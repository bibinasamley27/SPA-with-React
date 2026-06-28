import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// --- DATABASE UTILS ---
const DB_PATH = path.join(process.cwd(), 'database.json');

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Database {
  users: User[];
  tasks: Task[];
}

function readDB(): Database {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialDB: Database = { users: [], tasks: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
      return initialDB;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { users: [], tasks: [] };
  }
}

function writeDB(data: Database) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write database:', e);
  }
}

// --- PASSWORD UTILITY ---
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, originalHash] = stored.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch (e) {
    return false;
  }
}

// --- JWT TOKEN UTILITY ---
const JWT_SECRET = process.env.JWT_SECRET || 'task-management-secret-key-9876543210';

function generateJWT(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 })).toString('base64url'); // 24hr expiration
  
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(`${encodedHeader}.${encodedPayload}`);
  const signature = hmac.digest('base64url');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string): any {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature) return null;
    
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(`${encodedHeader}.${encodedPayload}`);
    const expectedSignature = hmac.digest('base64url');
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

// --- EXPRESS SERVER APP ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json());

  // CORS middleware for safety (though proxy serves both client and backend)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // --- AUTH MIDDLEWARE ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid or expired access token' });
    }
    
    req.user = decoded;
    next();
  };

  // --- API ROUTES ---

  // User Registration
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const db = readDB();
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDB(db);
    
    const token = generateJWT({ id: newUser.id, name: newUser.name, email: newUser.email });
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  });

  // User Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = generateJWT({ id: user.id, name: user.name, email: user.email });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  });

  // Get Current User
  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  });

  // --- TASK CRUD ---

  // Get Task Statistics
  app.get('/api/tasks/stats', authenticateToken, (req: any, res) => {
    const db = readDB();
    const userTasks = db.tasks.filter(t => t.userId === req.user.id);
    
    const totalTasks = userTasks.length;
    const pendingTasks = userTasks.filter(t => t.status === 'pending').length;
    const completedTasks = userTasks.filter(t => t.status === 'completed').length;
    const highPriorityTasks = userTasks.filter(t => t.priority === 'high' && t.status === 'pending').length;
    
    res.json({
      totalTasks,
      pendingTasks,
      completedTasks,
      highPriorityTasks
    });
  });

  // View All Tasks (with search, filter, sort, pagination)
  app.get('/api/tasks', authenticateToken, (req: any, res) => {
    const db = readDB();
    let userTasks = db.tasks.filter(t => t.userId === req.user.id);
    
    // 1. Search (by title or description)
    const search = req.query.search as string;
    if (search) {
      const s = search.toLowerCase();
      userTasks = userTasks.filter(t => 
        t.title.toLowerCase().includes(s) || 
        t.description.toLowerCase().includes(s)
      );
    }
    
    // 2. Filter by Status
    const status = req.query.status as string;
    if (status && status !== 'all') {
      userTasks = userTasks.filter(t => t.status === status);
    }
    
    // 3. Filter by Priority
    const priority = req.query.priority as string;
    if (priority && priority !== 'all') {
      userTasks = userTasks.filter(t => t.priority === priority);
    }
    
    // 4. Sorting
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    
    userTasks.sort((a: any, b: any) => {
      let comparison = 0;
      
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const weightA = priorityWeight[a.priority as 'high'|'medium'|'low'] || 0;
        const weightB = priorityWeight[b.priority as 'high'|'medium'|'low'] || 0;
        comparison = weightA - weightB;
      } else if (sortBy === 'dueDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        const dateA = new Date(a[sortBy] || 0).getTime();
        const dateB = new Date(b[sortBy] || 0).getTime();
        comparison = dateA - dateB;
      } else {
        const valA = String(a[sortBy] || '').toLowerCase();
        const valB = String(b[sortBy] || '').toLowerCase();
        comparison = valA.localeCompare(valB);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    // 5. Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedTasks = userTasks.slice(startIndex, endIndex);
    
    res.json({
      tasks: paginatedTasks,
      pagination: {
        total: userTasks.length,
        page,
        limit,
        totalPages: Math.ceil(userTasks.length / limit)
      }
    });
  });

  // Create Task
  app.post('/api/tasks', authenticateToken, (req: any, res) => {
    const { title, description, priority, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const db = readDB();
    const newTask: Task = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      title,
      description: description || '',
      status: 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // default 1 week
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.tasks.push(newTask);
    writeDB(db);
    
    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  });

  // View Single Task
  app.get('/api/tasks/:id', authenticateToken, (req: any, res) => {
    const db = readDB();
    const task = db.tasks.find(t => t.id === req.params.id && t.userId === req.user.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ task });
  });

  // Update Task (Full PUT or partial PATCH)
  const handleTaskUpdate = (req: any, res: any) => {
    const db = readDB();
    const taskIndex = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }
    
    const currentTask = db.tasks[taskIndex];
    const { title, description, status, priority, dueDate } = req.body;
    
    const updatedTask: Task = {
      ...currentTask,
      title: title !== undefined ? title : currentTask.title,
      description: description !== undefined ? description : currentTask.description,
      status: status !== undefined ? status : currentTask.status,
      priority: priority !== undefined ? priority : currentTask.priority,
      dueDate: dueDate !== undefined ? dueDate : currentTask.dueDate,
      updatedAt: new Date().toISOString()
    };
    
    db.tasks[taskIndex] = updatedTask;
    writeDB(db);
    
    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  };

  app.put('/api/tasks/:id', authenticateToken, handleTaskUpdate);
  app.patch('/api/tasks/:id', authenticateToken, handleTaskUpdate);

  // Delete Task
  app.delete('/api/tasks/:id', authenticateToken, (req: any, res) => {
    const db = readDB();
    const initialLength = db.tasks.length;
    
    db.tasks = db.tasks.filter(t => !(t.id === req.params.id && t.userId === req.user.id));
    
    if (db.tasks.length === initialLength) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }
    
    writeDB(db);
    res.json({ message: 'Task deleted successfully' });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to host 0.0.0.0 and port 3000 as mandated by runtime facts
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
