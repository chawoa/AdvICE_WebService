package com.icehufs.icebreaker.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.auth.SignInRequestDto;
import com.icehufs.icebreaker.dto.request.auth.SignUpRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignInResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignUpResponseDto;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.provider.JwtProvider;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        try{

            String email = dto.getEmail(); //이메일 중복을 확인해주는 코드
            boolean existsByEmail = userRepository.existsByEmail(email);
            if (existsByEmail) return SignUpResponseDto.duplicateEmail();

            String password = dto.getPassword(); //비밀번호를 암호화
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            User userEntity = new User(dto); //dto데이터를 entity에 삽입

            userRepository.save(userEntity); //entity를 repository를 통해 db에 저장

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();

        }

        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

        String token = null; //토큰 선업/초기화
        try{

            String email = dto.getEmail();  //요청으로 받은 이메일 존재 확인
            User userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return SignInResponseDto.signInFail();
            

            String password = dto.getPassword(); //요청 받은 비번과 해당 유저(이메일)의 비번 일치하는지 확인
            String encodedPassword = userEntity.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword); //입력 받은 비번과 db에 있는 암호화된 비번 확인;
            if(!isMatched) return SignInResponseDto.signInFail();

            token = jwtProvider.create(email); //토큰 생성


        } catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignInResponseDto.success(token);
        
    }

    
    
}
