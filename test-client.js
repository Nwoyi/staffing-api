const StaffingClient = require('./src/client/staffing-client');

async function testClient() {
  // Create a client instance
  const client = new StaffingClient({
    baseUrl: 'http://localhost:3000' // Make sure your API server is running on this URL
  });

  try {
    console.log('Testing Staffing API Client...\n');

    // 1. Create a staff member
    console.log('1. Creating a new staff member...');
    const newStaff = await client.createStaff({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering'
    });
    console.log('Created staff member:', newStaff);
    console.log('----------------------------------------\n');

    // 2. Get staff list
    console.log('2. Getting staff list...');
    const staffList = await client.getStaff({ page: 1, limit: 10 });
    console.log('Staff list:', staffList);
    console.log('----------------------------------------\n');

    // 3. Get specific staff member
    console.log('3. Getting staff member by ID...');
    const staff = await client.getStaffById(newStaff.id);
    console.log('Staff member details:', staff);
    console.log('----------------------------------------\n');

    // 4. Update staff member
    console.log('4. Updating staff member...');
    const updated = await client.updateStaff(staff.id, {
      position: 'Senior Developer',
      status: 'active'
    });
    console.log('Updated staff member:', updated);
    console.log('----------------------------------------\n');

    // 5. Delete staff member
    console.log('5. Deleting staff member...');
    await client.deleteStaff(updated.id);
    console.log('Staff member deleted successfully');
    console.log('----------------------------------------\n');

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testClient(); 