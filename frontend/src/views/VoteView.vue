<template>
    <div v-if="isLoggedIn">
        <h1>Vote for a Person</h1>
        <ul>
            <li v-for="person in persons" :key="person.id">
                <input type="radio" :value="person.id" v-model="selectedPersonId" :disabled="hasVoted" />
                {{ person.name }} ({{ person.age }})
            </li>
        </ul>
        <button @click="vote" :disabled="hasVoted">{{ hasVoted ? 'Vote Submitted' : 'Submit Vote' }}</button>
    </div>
</template>

<script>
import API from '@/services/api';
export default {
    data() {
        return {
            persons: [],
            selectedPersonId: null,
            hasVoted: false,
        };
    },
    async mounted() {
        if (!this.isLoggedIn) {
            this.$router.push("/");
        }
        await this.getUsers();
        this.checkIfVoted();
    },
    methods: {
        checkIfVoted() {
            const votedFor = JSON.parse(localStorage.getItem('user')).voted_for;
            if (votedFor) {
                this.selectedPersonId = parseInt(votedFor);
                this.hasVoted = true;
            }
        },
        async getUsers() {
            const response = await API.get("/candidate/");
            // this.persons = response.data.filter(person => person.is_eligible);
            this.persons = response.data;
            this.persons = this.persons.filter(person => person.is_eligible);
        },
        async vote() {
            if (this.selectedPersonId === null) {
                alert("Please select a person to vote for.");
                return;
            }
            const response = await API.post(`/candidate/vote/${this.selectedPersonId}`, {
                user_id: JSON.parse(localStorage.getItem('user')).id,
            });
            if (response.data.message) {
                alert(response.data.message);
            } else {
                // localStorage.setItem('user', JSON.stringify(response.data.user));
                let user = JSON.parse(localStorage.getItem('user'));
                user.voted_for = this.selectedPersonId;
                localStorage.setItem('user', JSON.stringify(user));
                this.$router.push("/results");
                checkIfVoted();
            }
        },
        
    },
    props: {
        isLoggedIn: Boolean,
    },
};
</script>