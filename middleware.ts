export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        //Now let's protect all our routes.
        "/trips",
        "/reservations",
        "/properties",
        "/favorites"
    ]
}