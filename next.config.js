/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [
            "avatars.githubusercontent.com",
            "lh3.googleusercontent.com",
            "res.cloudinary.com"
        ]
    }
}

module.exports = nextConfig


/* Anytime next.config.js is modified make sure you
   shut down the application and run it again.
*/
//"avatars.githubusercontent.com"