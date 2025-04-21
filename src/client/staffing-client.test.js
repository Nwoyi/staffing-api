const StaffingClient = require('./staffing-client');

// Mock fetch
global.fetch = jest.fn();

describe('StaffingClient', () => {
  let client;
  const mockBaseUrl = 'http://test-api.com';

  beforeEach(() => {
    client = new StaffingClient({ baseUrl: mockBaseUrl });
    fetch.mockClear();
  });

  describe('createStaff', () => {
    it('should create a new staff member', async () => {
      const mockStaff = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        position: 'Developer'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStaff)
      });

      const result = await client.createStaff({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        position: 'Developer'
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/staff`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            position: 'Developer'
          })
        })
      );
      expect(result).toEqual(mockStaff);
    });
  });

  describe('getStaff', () => {
    it('should fetch staff list with pagination', async () => {
      const mockResponse = {
        data: [{ id: '1', firstName: 'John' }],
        pagination: { page: 1, limit: 10, total: 1 }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.getStaff({ page: 1, limit: 10 });

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/staff?page=1&limit=10`,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getStaffById', () => {
    it('should fetch a specific staff member', async () => {
      const mockStaff = { id: '123', firstName: 'John' };
      const staffId = '123';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStaff)
      });

      const result = await client.getStaffById(staffId);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/staff/${staffId}`,
        expect.any(Object)
      );
      expect(result).toEqual(mockStaff);
    });
  });

  describe('updateStaff', () => {
    it('should update a staff member', async () => {
      const mockStaff = { id: '123', firstName: 'John', position: 'Senior Dev' };
      const staffId = '123';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStaff)
      });

      const result = await client.updateStaff(staffId, {
        position: 'Senior Dev'
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/staff/${staffId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ position: 'Senior Dev' })
        })
      );
      expect(result).toEqual(mockStaff);
    });
  });

  describe('deleteStaff', () => {
    it('should delete a staff member', async () => {
      const staffId = '123';

      fetch.mockResolvedValueOnce({
        ok: true
      });

      await client.deleteStaff(staffId);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/staff/${staffId}`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const errorResponse = {
        message: 'Staff member not found',
        code: 'NOT_FOUND'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse)
      });

      await expect(client.getStaffById('invalid-id')).rejects.toThrow(
        'Staff member not found'
      );
    });
  });
}); 