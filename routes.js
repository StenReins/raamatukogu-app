import express from "express";
import path from 'path';


export function homeRoutes(dir) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.sendFile(path.join(dir, "index.html"))
    });

    return router;
}

export function bookRoutes(dir) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.sendFile(path.join(dir, "index.html"));
    });
    router.get("/:bookId", (req, res) => {
        res.sendFile(path.join(dir, "pages", "book.html"))
    });

    return router;
}

export function userRoutes(dir) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.sendFile(path.join(dir, "index.html"));
    })
    router.get("/shelf/:name", (req, res) => {
        res.sendFile(path.join(dir, "pages", "shelf.html"));
    })
    router.get("/statistics", (req, res) => {
        res.sendFile(path.join(dir, "pages", "statistics.html"));
    });
    router.get("/settings", (req, res) => {
        res.sendFile(path.join(dir, "pages", "settings.html"));
    })
    
    return router;
}