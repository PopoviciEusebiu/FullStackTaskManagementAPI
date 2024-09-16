package project.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import project.constants.TaskStatus;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = TaskStatusSubsetValidator.class)
public @interface TaskStatusSubset {
    TaskStatus[] anyOf();

    String message() default "must be any of {anyOf}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
