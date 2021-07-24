import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { ROLENAME } from "../maze/Role";

@ObjectType()
class UserResponse {
  @Field(() => [String], { nullable: true })
  errors?: string[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  login(
    @Arg("username") username: string,
    @Ctx() { req }: MyContext
  ): UserResponse {
    const user = User.createUser(username);
    req.session.userid = user.id;
    return {
      user,
    };
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (req.session.userid === undefined) {
      return null;
    }

    return User.find(req.session.userid);
  }

  @Mutation(() => UserResponse)
  changeRole(
    @Arg("rolename", () => ROLENAME) rolename: ROLENAME,
    @Ctx() { req }: MyContext
  ): UserResponse {
    const userid = req.session.userid;
    if (userid == undefined) {
      return {
        errors: ["not login"],
      };
    }

    const user = User.find(userid);
    user.rolename = rolename;

    return {
      user,
    };
  }
}
