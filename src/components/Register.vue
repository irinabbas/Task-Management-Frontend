<template>
  <div class="register-form-container">
    <h2 class="form-title">Create an Account</h2>
    
    <!-- Registration Form -->
    <form @submit.prevent="register" class="register-form">
      
      <!-- Name Input -->
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          placeholder="Enter your full name"
          required
          :class="{'input-error': nameError}"
        />
        <span v-if="nameError" class="error-message">{{ nameError }}</span>
      </div>

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

      <!-- Confirm Password Input -->
      <div class="form-group">
        <label for="password_confirmation">Confirm Password</label>
        <input
          v-model="password_confirmation"
          type="password"
          id="password_confirmation"
          placeholder="Confirm your password"
          required
          :class="{'input-error': passwordConfirmationError}"
        />
        <span v-if="passwordConfirmationError" class="error-message">{{ passwordConfirmationError }}</span>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="isLoading" class="submit-button">
        <span v-if="isLoading">Submitting...</span>
        <span v-else>Register</span>
      </button>
    </form>

    <!-- Redirect to Login -->
    <p class="redirect-link">
      Already have an account? <router-link to="/login">Login here</router-link>.
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserRegister',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      isLoading: false,
      nameError: null,
      emailError: null,
      passwordError: null,
      passwordConfirmationError: null,
    };
  },
  methods: {
    validateForm() {
      this.nameError = this.name ? null : "Name is required.";
      this.emailError = this.email && /\S+@\S+\.\S+/.test(this.email)
        ? null
        : "Please enter a valid email address.";
      this.passwordError =
        this.password.length >= 8 ? null : "Password must be at least 8 characters.";
      this.passwordConfirmationError =
        this.password === this.password_confirmation ? null : "Passwords do not match.";

      return !(
        this.nameError || this.emailError || this.passwordError || this.passwordConfirmationError
      );
    },
    async register() {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        });

        console.log("Registration successful", response.data);
        // Optionally store token and user in Vuex or localStorage

        this.$router.push("/login"); // Redirect after registration (change as needed)
      } catch (error) {
        console.error("Registration failed", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-form-container {
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

.register-form {
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

.redirect-link {
  text-align: center;
  margin-top: 20px;
}

.redirect-link a {
  color: #007bff;
  text-decoration: none;
}

.redirect-link a:hover {
  text-decoration: underline;
}
</style>
