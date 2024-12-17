// import { defineStore } from "pinia";

// export const useVoteStore = defineStore('votes', {
//     state: () => ({
//         persons: string[],
//         votes: Record<string, number>,
//     }),
//     actions: {
//         addPerson(name: string) {
//             if (!this.persons.includes(name)) {
//                 this.persons.push(name);
//             }
            
//         },
//         castVote(name : string) {
//             if (this.votes[name] !== undefined) {
//                 this.votes[name]++;
//             }
//         },
//     },
// }