package project.utils;

import jakarta.persistence.PostPersist;
import project.model.User;

public class UserEventListener {
    @PostPersist
    public void notify(User user){
        System.out.println("New user created: " + user.getId());
    }
}
