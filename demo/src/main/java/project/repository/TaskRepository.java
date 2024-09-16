package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.constants.TaskStatus;
import project.model.Task;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Integer> {
    Task findTaskById(Integer taskId);

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.id = :userId")
    List<Task> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.id = :userId ORDER BY t.dueDate ASC")
    List<Task> findByUserIdOrderByDueDateAsc(@Param("userId") Integer userId);

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.id = :userId ORDER BY t.dueDate DESC")
    List<Task> findByUserIdOrderByDueDateDesc(@Param("userId") Integer userId);

    List<Task> findAllByStatus(TaskStatus taskStatus);

    List<Task> findByStatusAndDueDate(TaskStatus taskStatus, LocalDate dueDate);

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.username = :username")
    List<Task> findAllByUser_Username(@Param("username") String username);
}
