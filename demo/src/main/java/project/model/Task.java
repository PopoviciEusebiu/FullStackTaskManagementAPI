package project.model;


import jakarta.persistence.*;
import jakarta.xml.bind.annotation.XmlTransient;
import lombok.*;
import project.constants.TaskStatus;
import project.validators.TaskStatusSubset;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TASKS")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NonNull
    private String title;

    @NonNull
    private String description;

    @NonNull
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @TaskStatusSubset(anyOf = {TaskStatus.TODO, TaskStatus.DONE})
    private TaskStatus status;

    @XmlTransient
    @ManyToMany(mappedBy = "tasks", fetch = FetchType.EAGER)
    private List<User> users = new ArrayList<>();

    @XmlTransient
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @OneToMany(mappedBy = "task", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<Comment> comments;
}

