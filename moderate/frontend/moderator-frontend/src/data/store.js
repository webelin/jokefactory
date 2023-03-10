import { create } from "zustand"
import { ApiConnection } from "./api-connection"

const networkClient = new ApiConnection()

export const useAppStore = create(set => ({
  selectedJoke: {},
  jokes: [],
  pageLoading: false,
  user: { username: '', password: '' },
  loggedIn: false,
  loginError: false,
  setSelectedJoke: joke => set(() => {
    console.log(joke)
    return ({ selectedJoke: joke })
  }),
  clear: () => set(() => ({ selectedJoke: {} })),
  fetchJokes: async (user) => {
    const res = await networkClient.getJokes(user)
    set({ jokes: res })
  },
  clearJokes: () => set(() => ({ jokes: [] })),
  setLoading: loading => set(() => ({ pageLoading: loading })),
  login: async newUser => {
    const loginSuccessfull = await networkClient.login(newUser)
    if (loginSuccessfull) {
      set({ user: newUser, loggedIn: true })
    }
    else set({ loginError: true })
  }
}))
