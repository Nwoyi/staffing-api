const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CREATE staff member
const createStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, position, department } = req.body;
    const { data, error } = await supabase
      .from('staff')
      .insert([{ firstName, lastName, email, position, department }])
      .select();
    if (error) {
      if (error.code === '23505') { // unique violation
        return res.status(400).json({ code: 'DUPLICATE_EMAIL', message: 'Email already exists' });
      }
      return res.status(400).json({ code: 'CREATE_FAILED', message: error.message });
    }
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message });
  }
};

// LIST staff members (with pagination)
const listStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase
      .from('staff')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to);
    if (error) {
      return res.status(400).json({ code: 'LIST_FAILED', message: error.message });
    }
    res.json({
      data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message });
  }
};

// GET staff member by ID
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Staff member not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message });
  }
};

// UPDATE staff member
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    const { data, error } = await supabase
      .from('staff')
      .update(updateData)
      .eq('id', id)
      .select();
    if (error || !data || data.length === 0) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Staff member not found or update failed' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message });
  }
};

// DELETE staff member
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Staff member not found or delete failed' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message });
  }
};

module.exports = {
  createStaff,
  listStaff,
  getStaffById,
  updateStaff,
  deleteStaff
};