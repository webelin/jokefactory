import axios from "axios"
import { useAppStore } from "./store";

const http = axios.create({
  baseURL: "https://moderatorapp.azurewebsites.net/joke",
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptors
http.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
http.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export class ApiConnection {

  constructor() {
    this.types = []
  }

  getJokes() {
    const user = useAppStore.getState().user
    return http.get("", {
      headers: {
        User: user.username + ',' + user.password
      }
    })
  }

  approveJoke(id) {
    const user = useAppStore.getState().user
    return http.get(`/accept/${id}`, {
      headers: {
        User: user.username + ',' + user.password
      }
    })
  }

  rejectJoke(id) {
    const user = useAppStore.getState().user
    return http.get(`/reject/${id}`, {
      headers: {
        User: user.username + ',' + user.password
      }
    })
  }

  updateJoke(id, joke) {
    const user = useAppStore.getState().user
    return http.put(`/${id}`,
      joke,
      {
        headers: {
          User: user.username + ',' + user.password
        }
      }
    )
  }

  getTypes() {
    const user = useAppStore.getState().user
    //if (this.types == []) this.types = http.get('/types')
    return http.get("/types", {
      headers: {
        User: user.username + ',' + user.password
      }
    })
  }

  async login(user) {
    return await http.post("/login", user).then(() => true).catch(() => false)
  }
}
