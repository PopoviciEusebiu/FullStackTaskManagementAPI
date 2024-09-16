package project.service;

import org.springframework.stereotype.Component;
import project.model.ChatMessage;

@Component
public interface ChatService {
    ChatMessage processMessage(ChatMessage message);
    ChatMessage sendMessage(Integer groupId, ChatMessage message);}
