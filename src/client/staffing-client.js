const fetch = require('node-fetch');

class StaffingClient {
  /**
   * Create a new StaffingClient instance
   * @param {Object} options - Configuration options
   * @param {string} options.baseUrl - Base URL of the API (default: 'http://localhost:3000')
   * @param {Object} options.headers - Additional headers to include in requests
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
  }

  /**
   * Make an HTTP request to the API
   * @private
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // For DELETE requests, return null as they don't have a response body
    if (options.method === 'DELETE') {
      return null;
    }

    return response.json();
  }

  /**
   * Create a new staff member
   * @param {Object} staffData - Staff member data
   * @param {string} staffData.firstName - First name
   * @param {string} staffData.lastName - Last name
   * @param {string} staffData.email - Email address
   * @param {string} staffData.position - Job position
   * @param {string} [staffData.department] - Department
   * @returns {Promise<Object>} Created staff member
   */
  async createStaff(staffData) {
    return this._request('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    });
  }

  /**
   * Get a list of staff members
   * @param {Object} [options] - Pagination options
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=20] - Items per page
   * @returns {Promise<Object>} List of staff members with pagination info
   */
  async getStaff(options = {}) {
    const { page = 1, limit = 20 } = options;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    return this._request(`/staff?${queryParams}`);
  }

  /**
   * Get a staff member by ID
   * @param {string} id - Staff member ID
   * @returns {Promise<Object>} Staff member details
   */
  async getStaffById(id) {
    return this._request(`/staff/${id}`);
  }

  /**
   * Update a staff member
   * @param {string} id - Staff member ID
   * @param {Object} updateData - Fields to update
   * @param {string} [updateData.firstName] - First name
   * @param {string} [updateData.lastName] - Last name
   * @param {string} [updateData.email] - Email address
   * @param {string} [updateData.position] - Job position
   * @param {string} [updateData.department] - Department
   * @param {string} [updateData.status] - Status (active/inactive/on_leave)
   * @returns {Promise<Object>} Updated staff member
   */
  async updateStaff(id, updateData) {
    return this._request(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  /**
   * Delete a staff member
   * @param {string} id - Staff member ID
   * @returns {Promise<null>}
   */
  async deleteStaff(id) {
    return this._request(`/staff/${id}`, {
      method: 'DELETE'
    });
  }
}

module.exports = StaffingClient; 