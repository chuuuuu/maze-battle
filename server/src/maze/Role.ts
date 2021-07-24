import { Field, InterfaceType, ObjectType, registerEnumType } from "type-graphql";

@InterfaceType()
export abstract class Role {
  @Field()
  name: string;
  @Field()
  velocity: number;
}

@ObjectType({ implements: [Role] })
class Noob implements Role {
  name: string = "noob";
  velocity: number = 1;
}

export enum ROLENAME {
  NOOB,
}

registerEnumType(ROLENAME, {
  name: "ROLENAME",
  description: "list of rolename",
});

export class RoleFactory {
  static createRole(rolename: ROLENAME): Role {
    switch (rolename) {
      case ROLENAME.NOOB:
        return new Noob();

      default:
        return new Noob();
    }
  }
}
