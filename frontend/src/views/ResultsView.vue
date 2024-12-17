<template>
    <div>
        <h1>Current Poll results</h1>
        <ul>
            <li v-for="person in persons" :key="person.id">
                {{ person.name }} - {{ person.votes }} ({{ getVotePercentage(person.votes) }}%)
            </li>
        </ul>
    </div>
</template>

<script>
import API from '@/services/api';

export default {
    data() {
        return {
            persons: [],
        };
    },
    async mounted() {
        if (!this.isLoggedIn) {
            this.$router.push("/");
        }
        await this.getUsers();
    },
    methods: {
        async getUsers() {
            const response = await API.get("/candidate/");
            this.persons = response.data.sort((a, b) => b.votes - a.votes);
            this.persons = this.persons.filter(person => person.is_eligible);
        },
        async vote(personId) {
            const response = await API.post(`/vote/${personId}`);
            alert(response.data.message);
        },
        // dynamically calculate percentage of votes
        getVotePercentage(votes) {
            const totalVotes = this.persons.reduce((sum, person) => sum + person.votes, 0);
            return totalVotes ? ((votes / totalVotes) * 100).toFixed(2) : 0;
        }
    },
    props: {
        isLoggedIn: Boolean,
    },
};
</script>