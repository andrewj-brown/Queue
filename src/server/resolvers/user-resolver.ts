import { Ctx, FieldResolver, Query, Resolver } from "type-graphql";
import { Course, User } from "../entities";
import { MyContext } from "../types/context";
import { CourseStaff } from "../entities/course-staff";
import { StaffRole } from "../types/course-staff";

@Resolver(() => User)
export class UserResolver {
    @Query(() => User)
    async me(@Ctx() { req }: MyContext): Promise<User> {
        return req.user;
    }

    @FieldResolver(() => [CourseStaff])
    async getCourseStaff(@Ctx() { req }: MyContext): Promise<CourseStaff[]> {
        if (req.user.isAdmin) {
            return CourseStaff.create(
                (await Course.find()).map((course) => ({
                    courseId: course.id,
                    role: StaffRole.COORDINATOR,
                    userId: req.user.id,
                }))
            );
        }
        return await req.user.courseStaff;
    }
}
