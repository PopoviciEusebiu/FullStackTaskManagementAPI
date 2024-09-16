package project;

import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ProjectApplicationTests {

/*	@Mock
	private UserRepository userRepository;
	@Mock
	private TaskRepository taskRepository;
	@Mock
	private CommentRepository commentRepository;

	private UserService userService;
	private TaskService taskService;
	private CommentService commentService;

	private User user;
	private AuthDTO authDTO;
	private Task task;
	private Comment comment;

	@BeforeEach
	void setUp() {
		initMocks(this);
		userService = new UserServiceImpl(userRepository);
		taskService = new TaskServiceImpl(taskRepository);
		commentService = new CommentServiceImpl(commentRepository);
		user = new User();
		user.setId(1);
		user.setUsername("testUser");
		user.setPassword("testPass");
		task = new Task();
		task.setId(1);
		task.setTitle("testTask");
		comment = new Comment();
		comment.setContent("testComment");
		authDTO = new AuthDTO();
		authDTO.setUsername("testUser");
		authDTO.setPassword("testPass");
	}

	@Test
	void testCreateUser() {
		when(userRepository.save(any(User.class))).thenReturn(user);

		userService.createUser(user);


		verify(userRepository, times(1)).save(any(User.class));
	}

	@Test
	void testDeleteUserThrowsApiExceptionResponse() {
		Integer userId = 999;
		doThrow(ApiExceptionResponse.builder()
				.message("User not found")
				.status(HttpStatus.NOT_FOUND)
				.build())
				.when(userRepository).deleteById(userId);
		assertThrows(ApiExceptionResponse.class, () -> userService.deleteUser(userId));
	}

	@Test
	void testDeleteUserSuccess() throws ApiExceptionResponse {
		Integer userId = 1;

		when(userRepository.findById(userId)).thenReturn(Optional.of(user));

		userService.deleteUser(userId);

		verify(userRepository, times(1)).delete(user);
	}

	@Test
	void testLoginUser() throws ApiExceptionResponse {
		when(userRepository.findFirstByUsernameAndPassword(anyString(), anyString())).thenReturn(user);

		Optional<User> result = Optional.ofNullable(userService.login(authDTO));

		verify(userRepository, times(1)).findFirstByUsernameAndPassword(user.getUsername(), user.getPassword());
		assert result.isPresent();
		assert "testUser".equals(result.get().getUsername());
	}

	@Test
	void testCreateTask() {
		when(taskRepository.save(any(Task.class))).thenReturn(task);

		taskService.createTask(task);

		verify(taskRepository, times(1)).save(task);
	}

	@Test
	void testDeleteTaskSuccess() throws ApiExceptionResponse {
		Integer taskId = 1;

		when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

		taskService.deleteTask(taskId);

		verify(taskRepository, times(1)).delete(task);
	}

	@Test
	void testDeleteTaskThrowsApiExceptionResponse() {
		Integer taskId = 999;
		doThrow(ApiExceptionResponse.builder()
				.message("Task not found")
				.status(HttpStatus.NOT_FOUND)
				.build())
				.when(taskRepository).deleteById(taskId);

		assertThrows(ApiExceptionResponse.class, () -> taskService.deleteTask(taskId));
	}

	@Test
	void testCreateComment() {
		when(commentRepository.save(any(Comment.class))).thenReturn(comment);

		commentService.createComment(comment);

		verify(commentRepository, times(1)).save(comment);
	}

	@Test
	void testDeleteCommentSuccess() throws ApiExceptionResponse {
		Integer commentId = 1;

		when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

		commentService.deleteComment(commentId);

		verify(commentRepository, times(1)).delete(comment);
	}

	@Test
	void testDeleteCommentThrowsApiExceptionResponse() {
		Integer commentId = 999;
		doThrow(ApiExceptionResponse.builder()
				.message("Comment not found")
				.status(HttpStatus.NOT_FOUND)
				.build())
				.when(commentRepository).deleteById(commentId);

		assertThrows(ApiExceptionResponse.class, () -> commentService.deleteComment(commentId));
	}*/

}