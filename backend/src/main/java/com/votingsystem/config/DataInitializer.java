package com.votingsystem.config;

import com.votingsystem.entity.Candidate;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.User;
import com.votingsystem.enums.ElectionStatus;
import com.votingsystem.enums.Role;
import com.votingsystem.repository.CandidateRepository;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @SuppressWarnings("null")
    public CommandLineRunner initData() {
        return args -> {
            // 1. Create default admin if not exists
            if (userRepository.findByEmail("admin@securevote.com").isEmpty()) {
                User admin = User.builder()
                        .fullName("System Administrator")
                        .email("admin@securevote.com")
                        .registerNumber("ADMIN001")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                
                // 2. Create sample University Election
                if (electionRepository.findAll().isEmpty()) {
                    Election election = Election.builder()
                            .title("Student Council 2026")
                            .description("Annual election for the University Student Council President and Vice President roles.")
                            .startDate(LocalDateTime.now())
                            .endDate(LocalDateTime.now().plusDays(7))
                            .status(ElectionStatus.ACTIVE)
                            .createdBy(admin)
                            .build();
                    
                    Election savedElection = electionRepository.save(election);
                    
                    Candidate c1 = Candidate.builder()
                            .name("Arjun Sharma")
                            .party("Tech Forward")
                            .description("Engineering major focusing on lab accessibility and digital infrastructure.")
                            .election(savedElection)
                            .build();
                            
                    Candidate c2 = Candidate.builder()
                            .name("Priya Patel")
                            .party("Unity & Growth")
                            .description("Political Science major advocating for campus safety and diverse cultural festivals.")
                            .election(savedElection)
                            .build();
                            
                    Candidate c3 = Candidate.builder()
                            .name("Sarah Jenkins")
                            .party("Green Campus")
                            .description("Environmental Science major pushing for zero-waste initiatives.")
                            .election(savedElection)
                            .build();
                            
                    candidateRepository.saveAll(List.of(c1, c2, c3));
                    System.out.println(">>> Sample data initialized: Student Council 2026 <<<");
                }
            }
        };
    }
}
