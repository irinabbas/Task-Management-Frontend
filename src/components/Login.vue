<template>
    <div class="login-form-container">
      <h2 class="form-title">TM Tool</h2>
  
      <!-- Login Form -->
      <form @submit.prevent="login" class="login-form">
        
        <!-- Email Input -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email address"
            required
            :class="{'input-error': emailError}"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>
  
        <!-- Password Input -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            :class="{'input-error': passwordError}"
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" :disabled="isLoading" class="submit-button">
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
  
        <!-- Register Link -->
        <div class="register-link">
          <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserLogin',
    data() {
      return {
        email: '',
        password: '',
        isLoading: false,
        emailError: null,
        passwordError: null,
      };
    },
    methods: {
      validateForm() {
        this.emailError = this.email && /\S+@\S+\.\S+/.test(this.email)
          ? null
          : "Please enter a valid email address.";
        this.passwordError = this.password ? null : "Password is required.";
  
        return !(this.emailError || this.passwordError);
      },
      async login() {
        if (!this.validateForm()) {
          return;
        }
  
        this.isLoading = true;
  
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/login', {
            email: this.email,
            password: this.password,
          });
  
          console.log("Login successful", response.data);
          // Optionally store token and user in Vuex or localStorage
          localStorage.setItem('token', response.data.token);
  
          // Redirect to the dashboard
          this.$router.push("/dashboard");
        } catch (error) {
          console.error("Login failed", error);
          // Handle errors (e.g., invalid credentials)
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-form-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  input.input-error {
    border-color: red;
  }
  
  .error-message {
    color: red;
    font-size: 12px;
  }
  
  .submit-button {
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .register-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .register-link a {
    color: #007bff;
    text-decoration: none;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  </style>
  