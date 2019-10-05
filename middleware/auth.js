export default async function({ $axios, redirect }) {
  if ((await $axios.$get("/auth/token")).value) {
    redirect("/");
  }
}
