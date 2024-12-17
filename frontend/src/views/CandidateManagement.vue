<template>
  <div>
    <h1>Vote for a Person</h1>
    <ul>
      <!-- dynamically generate candidate list, including eligibility -->
      <li v-for="person in persons" :key="person.id">
        {{ person.name }} ({{ person.age }}) - {{ person.is_eligible ? 'Eligible' : 'Not Eligible' }}
      </li>
    </ul>
    <!-- form to create new users -->
    <h2>Create New User</h2>
    <!-- call createUser on submit -->
    <form @submit.prevent="createUser">
      <input v-model="name" placeholder="Name" required />
      <input v-model="age" type="number" placeholder="Age" required />
      <label>
        <input type="checkbox" v-model="isEligible" /> 
        Is Eligible
      </label>
      <button type="submit">Create User</button>
    </form>
  </div>
</template>

<script>
import API from '@/services/api';

export default {
  data() {
    return {
      persons: [],
      name: '',
      age: '',
      isEligible: false
    };
  },
  async mounted() {
    // if not logged redirect to login page
    if (!this.isLoggedIn) {
      this.$router.push("/");
    }
    // on page load, get users. 
    await this.getCandidates();
  },
  methods: {
    async getCandidates() {
      const response = await API.get("/candidate/");
      this.persons = response.data;
    },
    async createUser() {
      try {
        // todo: Add validation
        const response = await API.post("/candidate/", {
          name: this.name,
          age: this.age,
          is_eligible: this.isEligible,
        }).then(() => {
          this.getCandidates();
        });
        // alert(response.data.message);
      } catch (error) {
        alert(error.response.data.detail)
      }
    }
  },
  props: {
    isLoggedIn: Boolean,
  },
};
</script>