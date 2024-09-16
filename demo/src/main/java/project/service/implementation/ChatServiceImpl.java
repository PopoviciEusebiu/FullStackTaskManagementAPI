package project.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.model.ChatMessage;
import project.model.Group;
import project.model.User;
import project.repository.GroupRepository;
import project.repository.UserRepository;
import project.service.ChatService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Override
    public ChatMessage processMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd','HH:mm:ss")));
        System.out.println("Processing message: " + message.getContent());
        return message;
    }

    @Override
    public ChatMessage sendMessage(Integer groupId, ChatMessage message) {
        String username = message.getSender();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (!group.getMembers().contains(user)) {
            throw new IllegalStateException("User is not a member of the group.");
        }

        System.out.println("Sending message from ChatService: " + message.getContent());
        return processMessage(message);
    }
}