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
          <nav>
            <ul>
              <li><button @click="logout" class="logout-button">Logout</button></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <section class="task-section">
      <h3>Your Tasks</h3>

      <!-- Button to Add New Task (Trigger Modal) -->
      <!-- <button @click="showTaskForm = true" class="add-task-button">Add New Task</button> -->

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
                {{ newTask.id ? 'Update Task' : 'Add Task' }}
              </button>
              <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- <div v-if="filteredAndSortedTasks.length === 0">No tasks available</div> -->

      <div class="task-table-container">
        <div class="filters-and-sort">
          <div class="filter" style="margin-right: 20px; padding: 10px;">
            <label for="statusFilter" style="margin-right: 8px; font-weight: bold;">Filter by Status:</label>
            <select v-model="statusFilter" id="statusFilter" style="padding: 8px; border-radius: 4px; font-size: 14px;">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="sort" style="margin-right: 20px; padding: 10px;">
            <label for="sortByDate" style="margin-right: 8px; font-weight: bold;">Sort by Due Date:</label>
            <input type="date" v-model="sortOrder" id="sortByDate" style="padding: 8px; border-radius: 4px; font-size: 14px;">
          </div>
          <button @click="showTaskForm = true" class="add-task-button">Add New Task</button>
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
          <tbody v-if="filteredAndSortedTasks.length > 0">
            <tr v-for="(task, index) in filteredAndSortedTasks" :key="task.id">
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
          <tbody v-else>
            <tr>
              <td colspan="6" style="text-align: center;">No tasks available</td>
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
      statusFilter: '',
      sortOrder: '',
      errorMessage: '',
    };
  },
  computed: {
    // Computed property to filter and sort tasks
    filteredAndSortedTasks() {
      let filteredTasks = this.tasks;

      // Filter tasks by status
      if (this.statusFilter) {
        filteredTasks = filteredTasks.filter(
          (task) => task.status === this.statusFilter
        );
      }
      // Filter tasks by sortOrder
      if (this.sortOrder) {
        filteredTasks = filteredTasks.filter(
          (task) => task.due_date === this.sortOrder
        );
      }
      return filteredTasks
    },
  },
  created() {
    this.loadUserData();
    this.loadTasks();
  },
  methods: {
    async loadUserData() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      try {
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
      const token = localStorage.getItem('token');

      try {
        if (this.newTask.id) {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/tasks/${this.newTask.id}`,
            this.newTask,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const index = this.tasks.findIndex((task) => task.id === this.newTask.id);
          if (index !== -1) {
            this.tasks[index] = response.data;
          }
        } else {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/tasks',
            this.newTask,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          this.tasks.push(response.data);
        }

        this.closeModal();
        this.newTask = {};
      } catch (error) {
        console.error('Error creating/updating task:', error);
      }
    },

    closeModal() {
      this.showTaskForm = false;
      this.newTask = { title: '', description: '', due_date: '', status: 'Pending' };
    },

    async deleteTask(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },

    editTask(task) {
      this.showTaskForm = true;
      this.newTask = { ...task };
    },
  },
};
</script>

<style scoped>
/* General Styles */
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

.filters-and-sort {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filter, .sort {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  gap: 20px;
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
  box-sizing: border-box;
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

/* Navbar Styles */
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

/* Responsive Styles */
@media (max-width: 1024px) {
  .filters-and-sort {
    flex-direction: column;
    gap: 15px;
  }

  .task-table th,
  .task-table td {
    padding: 10px;
  }

  .task-table {
    font-size: 14px;
  }

  .navbar-container {
    flex-direction: column;
    align-items: center;
  }

  .task-form-container {
    width: 90%;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px;
  }

  .task-table-container {
    padding: 15px;
  }

  .task-table {
    font-size: 12px;
  }

  .task-table th,
  .task-table td {
    padding: 8px;
  }

  .filters-and-sort {
    flex-direction: column;
    gap: 10px;
  }

  .add-task-button {
    width: 100%;
  }

  .modal-content {
    width: 90%;
  }

  .task-form-container {
    width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 10px 15px;
  }

  .task-table-container {
    padding: 10px;
  }

  .task-table th,
  .task-table td {
    padding: 6px;
  }

  .filters-and-sort {
    flex-direction: column;
    gap: 8px;
  }

  .form-input {
    font-size: 12px;
  }

  .submit-button,
  .cancel-button {
    font-size: 12px;
  }

  .logout-button {
    font-size: 12px;
  }
}
</style>
