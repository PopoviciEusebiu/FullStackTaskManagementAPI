package project;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import project.dto.RoleDTO;
import project.model.User;
import project.repository.CommentRepository;
import project.repository.RoleRepository;
import project.repository.TaskRepository;
import project.repository.UserRepository;
import project.service.CommentService;
import project.service.TaskService;
import project.service.UserService;

import java.util.List;

@SpringBootApplication
@EnableScheduling
public class ProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}
	@Bean
	CommandLineRunner init(UserService userService, UserRepository userRepository, RoleRepository roleRepository, TaskService taskService, TaskRepository taskRepository, CommentService commentService, CommentRepository commentRepository) {
		return args -> {
			userService.setAllUsersLoggedFalse();

			RoleDTO role1 = RoleDTO.builder().role("ADMIN").build();
			RoleDTO role2 = RoleDTO.builder().role("USER").build();
			//roleRepository.saveAll(List.of(role1, role2));


			User user2 = User.builder()
					.username("ala")
					.firstName("bak")
					.lastName("sasa")
					.password("parola")
					.emailAddress("ss.sss@yahoo.com")
					.roles(List.of(roleRepository.findByRole("ADMIN")))
					.build();

			User user1 = User.builder()
					.username("sebik")
					.firstName("Eusebiu")
					.lastName("Popovici")
					.emailAddress("sebipopovici2002@yahoo.com")
					.roles(List.of(roleRepository.findByRole("ADMIN")))
					.password("pp")
					.build();


			//userService.createUser(user2);
			//userService.createUser(user2);

			/*UserDTO savedUser1;
			UserDTO savedUser2;

			savedUser1 = userService.getUserById(1);
			savedUser2 = userService.getUserById(2);


			//System.out.println(userService.getAllUsers());
			//System.out.println(userService.getUserById(1));
			//userService.updateUser(user1,1);

			//userService.deleteUser(1);



			TaskDTO task1 = TaskDTO.builder()
					.title("Finalizare proiect")
					.description("Trebuie să finalizăm proiectul de procesare de imagini.")
					.dueDate(LocalDate.of(2024, 3, 31))
					.status(TODO)
					.user(savedUser1)
					.build();

			TaskDTO task2 = TaskDTO.builder()
					.title("Întâlnire echipă")
					.description("Programați o întâlnire de echipă pentru a discuta despre progresul proiectului.")
					.dueDate(LocalDate.of(2024, 4, 5))
					.status(TODO)
					.user(savedUser1)
					.build();

			TaskDTO task3 = TaskDTO.builder()
					.title("Review cod")
					.description("Revizuiți codul pentru modulele recent dezvoltate.")
					.dueDate(LocalDate.of(2024, 2, 10))
					.status(DONE)
					.user(savedUser2)
					.build();

			TaskDTO taskForUpdate = TaskDTO.builder()
					.title("Project PS")
					.description("Terminati primul assignment din proiect.")
					.dueDate(LocalDate.of(2024, 2, 10))
					.status(DONE)
					.build();


			//taskService.createTask(task1);
			//taskService.createTask(task3);

			TaskDTO savedTask1 = taskService.getTaskById(1);
			TaskDTO savedTask2 = taskService.getTaskById(2);

			//taskService.updateTask(taskForUpdate,1);
			//taskService.deleteTask(2);


			CommentDTO comment1 = CommentDTO.builder()
					.user(savedUser1)
					.task(savedTask1)
					.content("Acesta este un comentariu foarte important pentru task-ul 1.")
					.build();

			CommentDTO comment2 = CommentDTO.builder()
					.user(savedUser1)
					.task(savedTask1)
					.content("Un alt comentariu relevant pentru task-ul 2.")
					.build();

			CommentDTO comment3 = CommentDTO.builder()
					.user(savedUser2)
					.task(savedTask2)
					.content("Utilizatorul 2 adaugă un comentariu la task-ul 1.")
					.build();

			//commentService.createComment(comment1);
			//commentService.createComment(comment2);
			//commentService.createComment(comment3);
			//commentService.deleteComment(3);

			AuthDTO dto = new AuthDTO();
			dto.setUsername("sebik");
			dto.setPassword("sebik123");
			userService.login(dto);
			System.out.println("User succesfully logged in: " + dto);

*/
		};
	}

}
