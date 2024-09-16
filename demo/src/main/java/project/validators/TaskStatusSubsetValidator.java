package project.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import project.constants.TaskStatus;

import java.util.Arrays;

public class TaskStatusSubsetValidator implements ConstraintValidator<TaskStatusSubset, TaskStatus> {

    private TaskStatus[] subset;

    @Override
    public void initialize(TaskStatusSubset constraintAnnotation) {
        this.subset = constraintAnnotation.anyOf();
    }

    @Override
    public boolean isValid(TaskStatus taskStatus, ConstraintValidatorContext constraintValidatorContext) {
        return Arrays.asList(subset).contains(taskStatus);
    }
}
