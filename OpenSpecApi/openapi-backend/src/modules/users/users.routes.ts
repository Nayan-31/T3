import { Router } from "express";

const router = Router();

type User = {
  id: string;
  name: string;
};

const users: User[] = [
  { id: "1", name: "Nayan" },
  { id: "2", name: "Asha" },
];

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [id, name]
 *       properties:
 *         id:
 *           type: string
 *           example: '1'
 *         name:
 *           type: string
 *           example: Nayan
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Users ki list lao
 *     responses:
 *       '200':
 *         description: Users ki list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", (_req, res) => {
  res.json(users);
});

export default router;