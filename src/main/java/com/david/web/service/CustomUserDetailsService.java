package com.david.web.service;

import com.david.web.model.User;
import com.david.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class CustomUserDetailsService implements ReactiveUserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private List<GrantedAuthority> getAuthorities(User user) {
        Set<String> roles = user.getRoles();
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        for (String role : roles) {
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return authorities;
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        Mono<User> user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return Mono.just(new org.springframework.security.core.userdetails.User(user.block().getUsername(), user.block().getPassword(), user.block().isEnabled(), user.block().isAccountNonExpired(),
                user.block().isCredentialsNonExpired(), user.block().isAccountNonLocked(), Collections.emptyList()));

    }
}
