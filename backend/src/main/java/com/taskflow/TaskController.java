
package com.taskflow;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> getTasks() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task addTask(@RequestBody Map<String, String> body) {
        String taskName = body.get("task");

        if (taskName == null || taskName.trim().isEmpty()
                || taskName.length() > 255) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task must contain 1-255 characters"
            );
        }

        return repository.save(new Task(taskName.trim()));
    }
}