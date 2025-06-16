import { call } from "redux-saga/effects";
import { action } from "../entities/decorators";
import { BaseEntity2 } from "./BaseEntity";
import type { IPagerParams } from "./types";
import { IEntityContainer } from "../entities";

export class SomeEntity extends BaseEntity2{
  protected schema = {};
  protected name:keyof IEntityContainer = 'UserEntity';
  @action
  public *fetchProjectPage(data: IPagerParams) {
    yield call(this.pageEntity, '/projects/page', data);
  }
}