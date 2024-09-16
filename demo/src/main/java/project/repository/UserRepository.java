package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    /*@EntityGraph(type = EntityGraph.EntityGraphType.FETCH,
            attributePaths = {"roles"})
    Optional<User> findByUsername(String username);

    @EntityGraph(type = EntityGraph.EntityGraphType.FETCH,
            attributePaths = {"roles"})
    List<User> findAll();



    boolean existsByEmailAddress(String emailAddress);*/
    @Query("Select u from User u WHERE u.username = ?#{ principal.username}")
    Optional<User> findLoginUser();
    User findFirstByUsernameAndPassword(String username, String password);
    User findByUsername(String username);
    User findUserById(Integer id);

}