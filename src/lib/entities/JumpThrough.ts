import { Vector2 } from "gdxts";

import { Point } from "../struct/point";
import { Rect } from "../struct/rect";
import { isRidingJumpthrough } from "../utils/collisionUtils";
import { moveX, moveY } from "../utils/movementUtils";
import {
  Entity,
  EntityType,
  IPlatformWorld,
  JumpThroughPlatform,
} from "../world";

export class JumpThrough implements JumpThroughPlatform {
  id: number;
  type: EntityType;
  world: IPlatformWorld;

  position: Vector2;
  speed: Vector2;
  remainder: Vector2;
  size: Vector2;
  hitbox: Rect;

  constructor(_id: number, body: Rect, _hitbox?: Rect) {
    this.id = _id;
    this.position = new Vector2(body.x, body.y);
    this.size = new Vector2(body.width, body.height);
    if (_hitbox) {
      this.hitbox = _hitbox;
    } else {
      this.hitbox = {
        x: 0,
        y: 0,
        width: body.width,
        height: body.height,
      };
    }

    this.type = EntityType.JUMP_THROUGH;
    this.remainder = new Vector2(0, 0);
    this.speed = new Vector2(0, 0);
  }

  get sceneHitbox(): Rect {
    return {
      x: this.position.x + this.hitbox.x,
      y: this.position.y + this.hitbox.y,
      width: this.hitbox.width,
      height: this.hitbox.height,
    };
  }

  get exactPosition(): Point {
    return {
      x: this.position.x + this.remainder.x,
      y: this.position.y + this.remainder.y,
    };
  }

  findRiders(riders: Entity[]) {
    for (let i = 0; i < this.world.getEntities(EntityType.ACTOR).length; i++) {
      if (
        isRidingJumpthrough(this.world.getEntities(EntityType.ACTOR)[i], this)
      ) {
        riders.push(this.world.getEntities(EntityType.ACTOR)[i]);
      }
    }
  }

  move(x: number, y: number) {
    moveX(x, this, this.world);
    moveY(y, this, this.world);

    const riders: Entity[] = [];
    this.findRiders(riders);

    for (let r of riders) {
      moveX(x, r, this.world);
      moveY(y, r, this.world);
    }
  }

  moveTo(pos: Vector2) {
    this.move(pos.x - this.exactPosition.x, pos.y - this.exactPosition.y);
  }

  update(_delta: number) {}
}
