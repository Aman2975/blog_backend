// src/types/express.d.ts
import { JwtPayload} from '../common/types/jwt.types'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};