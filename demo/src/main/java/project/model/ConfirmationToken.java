package project.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table
@Getter
@Setter
public class ConfirmationToken {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Integer id;

        @Column
        private String confirmationToken;

        @OneToOne
        @JoinColumn(name = "user_id")
        private User user;

        private LocalDate createdTime;

        private LocalDate confirmationTime;

        private LocalDate expireTime;




}
