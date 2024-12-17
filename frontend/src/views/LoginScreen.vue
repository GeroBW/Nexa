<template>
  <div class="container">
    <div class="form-container">
      <!-- check form toffle -->
      <button class="toggle-button" @click="toggleForm">{{ isLogin ? 'Switch to Register' : 'Switch to Login' }}</button>
      <!-- display appropriate form -->
      <form v-if="isLogin" @submit.prevent="login" class="form">
        <input v-model="username" placeholder="Username" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />
        <br />
        <button type="submit" class="submit-button">Login</button>
      </form>
      <form v-else @submit.prevent="register" class="form">
        <input v-model="username" placeholder="Username" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />
        <br />
        <input v-model="email" placeholder="Email" class="input" />
        <br />
        <button type="submit" class="submit-button">Register</button>
      </form>
      <!-- display info message if there is one -->
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import API from "@/services/api";

export default {
  data() {
    return {
      username: "",
      password: "",
      email: "",
      isLogin: true,
      message: "",
    };
  },
  emits: ['login', 'isAdmin'],
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.message = ""; // Clear message when toggling form
    },
    async register() {
      try {
        const response = await API.post("/auth/register", {
          username: this.username,
          password: this.password,
          email: this.email,
        });
        this.toggleForm();
      } catch (error) {
        this.message = error.response.data.detail;
      }
    },
    async login() {
      try {
        const response = await API.post("/auth/login", {
          username: this.username,
          password: this.password,
        });
        // init user and safe in localstorage based on response data
        const user = {
          username: response.data.user.username,
          email: response.data.user.email,
          id: response.data.user.id,
          is_admin: response.data.user.is_admin,
          voted_for: response.data.user.voted_for,
          token: response.data.user.token,
        };
        localStorage.setItem('user', JSON.stringify(user));
        console.log(user);
        // check if admin and redirect to appropriate site
        if (user.is_admin) {
          this.$emit('isAdmin');
          this.$router.push("/candidates");
        } else {
          this.$router.push("/vote");
        }
        // signal that an login event happened
        this.$emit('login');
      } catch (error) {
        // display info message on error
        console.log(error);
        this.message = error.response.data.detail;
      }
    }
  }
};
</script>
