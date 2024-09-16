package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.model.ConfirmationToken;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Integer> {

    Optional<ConfirmationToken> findConfirmationTokenByConfirmationToken(String token);

    @Modifying
    @Query("UPDATE ConfirmationToken c SET c.confirmationToken = :newToken, c.confirmationTime = :newConfirmationTime, c.expireTime = :newExpireTime WHERE c.id = :tokenId")
    int updateToken(String newToken, LocalDate newConfirmationTime, LocalDate newExpireTime, Integer tokenId);

    void deleteConfirmationTokenByConfirmationToken(String confirmationToken);
}
