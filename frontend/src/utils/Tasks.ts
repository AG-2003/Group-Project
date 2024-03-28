import { auth } from "../firebase-config";
import { BadgesType } from "../interfaces/BadgesType";

export const initialBadges: BadgesType[] = [
    { name: 'Verify email', status: auth.currentUser?.emailVerified || false },
    { name: 'Create a document', status: false },
    { name: 'Join a team', status: false },
    { name: 'Create a spreadsheet', status: false },
    { name: 'Create a whiteboard', status: false },
    { name: 'Join a community', status: false },
    { name: 'Post in any community', status: false },
    { name: 'Get 10 likes on a community Post', status: false },
    { name: 'Get 100 likes on a community Post', status: false },
    { name: 'Get 500 likes on a community Post', status: false },
    { name: 'Get 1000 likes on a community Post', status: false },
    { name: 'Get 5000 likes on a community Post', status: false },
    { name: 'Get 10000 likes on a community Post', status: false },
    { name: 'Place top 3 in a community leaderboard', status: false },
    { name: 'Place 1st in a community leaderboard', status: false },
    { name: 'Create a community', status: false },
    { name: 'Reach 10 daily user in your community', status: false },
    { name: 'Reach 100 daily user in your community', status: false },
    { name: 'Reach 500 daily user in your community', status: false },
    { name: 'Reach 1000 daily user in your community', status: false },

]