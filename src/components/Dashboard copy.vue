<template>
    <div class="dashboard-container">
      <!-- Navigation Bar -->
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <p style="font-size: 16px;font-weight: bold;">TM Tool</p>
        </div>

        <!-- User Info and Navigation Links -->
        <div class="user-info">
          <p v-if="userName"><i class="fas fa-user-circle"></i>{{ userName }}</p>
          <!-- <p v-else>Welcome back, User!</p> -->

          <nav>
            <ul>
              <!-- <li><router-link to="/dashboard">Dashboard</router-link></li>
              <li><router-link to="/tasks">Tasks</router-link></li>
              <li><router-link to="/profile">Profile</router-link></li> -->
              <li><button @click="logout" class="logout-button">Logout</button></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  
      <section class="task-section">
        <h3>Your Tasks</h3>
  
    <!-- Button to Add New Task (Trigger Modal) -->
    <button @click="showTaskForm = true" class="add-task-button">Add New Task</button>

<!-- Modal for Task Form -->
<div v-if="showTaskForm" class="modal-overlay">
  <div class="modal-content">
    <h2>Add New Task</h2>
    <form @submit.prevent="createTask" class="task-form">
      <div class="form-group">
        <label for="title">Task Title</label>
        <input
          id="title"
          v-model="newTask.title"
          type="text"
          placeholder="Enter task title"
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="description">Task Description</label>
        <textarea
          id="description"
          v-model="newTask.description"
          placeholder="Enter task description"
          required
          class="form-input"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="due_date">Due Date</label>
        <input
          id="due_date"
          v-model="newTask.due_date"
          type="date"
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select
          id="status"
          v-model="newTask.status"
          class="form-input"
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button">
          {{ newTask.id ? 'Update Task' : 'Add Task' }}</button>
        <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
</div>
  
        <div v-if="tasks.length === 0">No tasks available</div>
  
        <div class="task-table-container">
          <div class="filters-and-sort">
            <div class="filter">
              <label for="statusFilter">Filter by Status:</label>
              <select v-model="statusFilter" id="statusFilter">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div class="sort">
              <label for="sortByDate">Sort by Due Date:</label>
              <select v-model="sortOrder" id="sortByDate">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <!-- Table for displaying tasks -->
          <table class="task-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Task Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in tasks" :key="task.id">
                <td>{{ index + 1 }}</td>
                <td>{{ task.title }}</td>
                <td>{{ task.description }}</td>
                <td>{{ task.status }}</td>
                <td>{{ task.due_date }}</td>
                <td>
                  <button @click="editTask(task)" class="btn-edit">Edit</button>
                  <button @click="deleteTask(task.id)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserDashboard',
    data() {
      return {
        userName: '',
        userEmail: '',
        tasks: [],
        showTaskForm: false,
        newTask: {
          title: '',
          description: '',
          due_date: '',
          status: 'Pending',
        },
        errorMessage: '',
      };
    },
    computed: {
      // Computed property to filter and sort tasks
      filteredAndSortedTasks() {
        // Filter tasks by status
        let filteredTasks = this.tasks;

        if (this.statusFilter) {
          filteredTasks = filteredTasks.filter(task => task.status === this.statusFilter);
        }

        // Sort tasks by due date
        return filteredTasks.sort((a, b) => {
          const dateA = new Date(a.due_date);
          const dateB = new Date(b.due_date);

          if (this.sortOrder === 'asc') {
            return dateA - dateB; // Ascending order
          } else {
            return dateB - dateA; // Descending order
          }
        });
      },
    },
    created() {
      this.loadUserData();
      this.loadTasks();
    },
    methods: {
      editTask(task) {
        this.showTaskForm = true
        // Set the selected task to the clicked task
        this.newTask = { ...task }; // Create a copy to avoid direct mutation
      },
      async loadUserData() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.$router.push('/login');
            return;
          }
  
          const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          this.userName = response.data.name;
          this.userEmail = response.data.email;
        } catch (error) {
          this.errorMessage = 'Unable to fetch user data. Please log in again.';
          this.$router.push('/login');
        }
      },
  
      async loadTasks() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          this.tasks = response.data;
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      },
  
      async createTask() {
        try {
          const token = localStorage.getItem('token');
          
          // Check if the task has an ID (meaning it's an update operation)
          if (this.newTask.id) {
            // If task.id exists, we are updating an existing task (PUT request)
            const response = await axios.put(
              `http://127.0.0.1:8000/api/tasks/${this.newTask.id}`, 
              this.newTask, 
              { 
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // Update the task in the tasks array with the updated data
            const index = this.tasks.findIndex(task => task.id === this.newTask.id);
            if (index !== -1) {
              this.tasks[index] = response.data; // Update task data in the array
            }
          } else {
            // If task.id doesn't exist, we are creating a new task (POST request)
            const response = await axios.post(
              'http://127.0.0.1:8000/api/tasks', 
              this.newTask, 
              { 
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // Push the new task into the tasks array
            this.tasks.push(response.data);
          }

          // Close the modal after submitting the task
          this.closeModal();

          // Reset the form data
          this.newTask = {};

        } catch (error) {
          console.error('Error creating/updating task:', error);
        }
      }, 
      // Close the modal and reset the form
        closeModal() {
        this.showTaskForm = false;
        this.newTask = { title: '', description: '', due_date: '', status: 'Pending' };
        },
      async deleteTask(id) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          this.tasks = this.tasks.filter((task) => task.id !== id); // Remove the task from the list
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },
  
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style scoped>
  .filters-and-sort {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .filter, .sort {
    display: flex;
    align-items: center;
  }
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Task Form Styles */
.add-task-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px 0;
}

.add-task-button:hover {
  background-color: #45a049;
}

.task-form-container {
  width: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px; /* Adds space between form elements */
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box; /* Ensures padding doesn't affect width */
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-button,
.cancel-button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button {
  background-color: #4caf50;
  color: white;
}

.submit-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #e53935;
}
  .navbar {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info p {
  margin-right: 20px;
  font-size: 16px;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin-left: 20px;
}

nav a {
  text-decoration: none;
  color: white;
  font-size: 16px;
  padding: 10px;
  border-radius: 5px;
}

nav a:hover {
  background-color: #34495e;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c0392b;
}
  .task-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.submit-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button:hover {
  background-color: #e53935;
}
  .dashboard-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .dashboard-header {
    text-align: center;
  }
  
  .task-section {
    margin-top: 20px;
  }
  
  .logout-section {
    margin-top: 20px;
    text-align: center;
  }
  
  .logout-button {
    padding: 10px 20px;
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .logout-button:hover {
    background-color: #c0392b;
  }
  .task-table-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.task-table th,
.task-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.task-table th {
  background-color: #4CAF50;
  color: white;
}

.task-table td {
  background-color: #fff;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  cursor: pointer;
}

.btn-edit {
  background-color: #4CAF50;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-edit:hover {
  background-color: #45a049;
}

.btn-delete:hover {
  background-color: #d32f2f;
}
  </style>
  