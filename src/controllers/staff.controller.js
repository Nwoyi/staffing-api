const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let staffMembers = [];

const createStaff = (req, res) => {
  const { firstName, lastName, email, position, department } = req.body;
  
  const newStaff = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    position,
    department,
    status: 'active',
    hireDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  staffMembers.push(newStaff);
  
  res.status(201).json(newStaff);
};

const listStaff = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedStaff = staffMembers.slice(startIndex, endIndex);
  const total = staffMembers.length;

  res.json({
    data: paginatedStaff,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
};

const getStaffById = (req, res) => {
  const staff = staffMembers.find(member => member.id === req.params.id);
  
  if (!staff) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Staff member not found'
    });
  }

  res.json(staff);
};

const updateStaff = (req, res) => {
  const index = staffMembers.findIndex(member => member.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Staff member not found'
    });
  }

  const updatedStaff = {
    ...staffMembers[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  staffMembers[index] = updatedStaff;
  res.json(updatedStaff);
};

const deleteStaff = (req, res) => {
  const index = staffMembers.findIndex(member => member.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Staff member not found'
    });
  }

  staffMembers.splice(index, 1);
  res.status(204).send();
};

module.exports = {
  createStaff,
  listStaff,
  getStaffById,
  updateStaff,
  deleteStaff
}; 