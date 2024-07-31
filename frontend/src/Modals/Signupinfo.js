import React, { useState, useEffect } from 'react';
import './modules.css';
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트
import { signUpRequest, emailCertificationRequest, checkCertificationRequest } from '../apis/index.js';




const SignUpinfoForm = ({ closeModal }) => {
  const [userCertificationNumber, setUsercertificationNumber] = useState('');
  const [userName, setUsername] = useState('');
  const [userStudentnum, setUserstudentnum] = useState('');
  const [userPassword, setUserpassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userReenteredPassword, setUserReenteredPassword] = useState(''); // 비밀번호 재입력을 위한 새로운 상태
  const [isCertified, setIsCertified] = useState(false); // 이메일 인증 여부를 확인하는 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState(false); // 에러 상태 추가
  const navigator = useNavigate();
  const [cookies, setCookie] = useCookies(['accessToken']); //데베에 있는 데이터 호출 시 사용 예정
  const [emailRegistered, setEmailRegistered] = useState(false);



  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  useEffect(() => {
    let timer;
    if (buttonDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            clearInterval(timer);
            setButtonDisabled(false);
            return 60;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [buttonDisabled]);





  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms || !agreePrivacy) {
      alert('이용약관 및 개인정보처리방침에 동의해주세요.');
      return;
    }
  };

  const onSignUpButtonClickHandler = () => {
    if (userPassword !== userReenteredPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isCertified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    if (userStudentnum.length < 5) {
      alert('학번을 다시 입력해주세요.');
      return;
    }


    const requestBody = { email: userEmail, name: userName, studentNum: userStudentnum, password: userPassword };
    signUpRequest(requestBody)
      .then(response => signUpResponse(response))
  };

  const onCheckCertificationHandler = (e) => {
    e.preventDefault();
    const requestBody = { email: userEmail, certificationNumber: userCertificationNumber };
    checkCertificationRequest(requestBody)
      .then(response => checkCertificationResponse(response))
      .catch(error => {
        console.error('인증 확인 요청 중 오류 발생:', error);
        alert('네트워크 이상입니다.');
      });
  };

  const onEmailCertificationHandler = (e) => {
    e.preventDefault();
    if (!buttonDisabled) {
      setButtonDisabled(true);
      const requestBody = { email: userEmail };
      emailCertificationRequest(requestBody)
        .then(response => emailCertificationResponse(response))
        .catch(error => {
          console.error('이메일 인증 요청 중 오류 발생:', error);
          alert('네트워크 이상입니다.');
          setButtonDisabled(false);
          setCountdown(60);
        });
    }
  };

  const signUpResponse = (responseBody) => {
    if (!responseBody) {
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody;

    switch (code) {
      case 'SU':
        alert('회원가입이 성공적으로 완료되었습니다.');
        navigator('/');  // 로그인 후 리다이렉트
        closeModal();
        // 모달 창 닫기
        // 성공적으로 회원가입을 완료했다는 상태 업데이트를 부모에 전달
        break; // 함수 종료를 확실하게 함
      case 'DBE':
        alert('데이터베이스 오류입니다.');
        break;
      case 'SF':
      case 'VF':
        setError(true);
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        break;
      default:
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        break;
    }
  };


  const emailCertificationResponse = (responseBody) => { //이메일 인증
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DE') alert('이미 회원가입된 이메일 입니다');
    else if (code === 'MF') alert('이메일 전송 실패');
    else if (code === 'DBE') alert('데이터베이스 오류임');
    else if (code === 'SF' || code === 'VF') setError(true);
    else if (code !== 'SU');
    else if (code === 'SU') alert('인증번호가 전송이 되었습니다.');
    return;
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }
  // 폼 제출 핸들러

  const checkCertificationResponse = (responseBody) => { //이메일 인증
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DBE');
    else if (code === 'VF') alert('인증번호가 잘못되었음요.');
    else if (code !== 'SU');
    else if (code === 'SU') {
      setIsCertified(true);
      alert('인증이 완료 되었습니다.');
    }
    return;
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }


  return (

    <form onSubmit={handleSubmit}>
      <div className="signupHeaderContainer">
        <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
      </div>


      <label htmlFor="user_email" ></label>
      <p>이메일 인증</p>

      <div className="signUpContainer">
        <label htmlFor="user_email" ></label>
        <input
          type="text"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="학교 이메일"
        />
        <span className="emailDomain">@hufs.ac.kr</span>
        <button type="button" className="SignupFormpost" onClick={onEmailCertificationHandler}>인증요청</button>
      </div>
      {buttonDisabled && <span className="countdown-timer">{countdown}초 후에 다시 시도 가능합니다.</span>}

      <div className="emailpost" >
        <label htmlFor="password"></label>
        <input
          type="text"
          value={userCertificationNumber}
          onChange={e => setUsercertificationNumber(e.target.value)}
          placeholder="인증번호를 입력해주세요."
        />
        <button type="button" className="SignupFormpost" onClick={onCheckCertificationHandler}>인증</button>
      </div>



      <div className="signup_name" >
        <p>이름</p>
        <input

          value={userName}
          onChange={e => setUsername(e.target.value)}
          placeholder=" 이름을 입력해주세요."
        />
      </div>

      <div className="signup_pw" >
        <p>학번</p>
        <input

          value={userStudentnum}
          onChange={e => setUserstudentnum(e.target.value)}
          placeholder=" 학번을 입력해주세요. (ex.2020XXXXX)"
          minLength={6}
        />
      </div>

      <div className="signup_pw" >
        <p>비밀번호</p>
        <input
          type="password"
          value={userPassword}
          onChange={e => setUserpassword(e.target.value)}
          placeholder=" 비밀번호는 8자 이상 20자 미만이어야합니다."
        />
      </div>

      <div className="signup_pw" >
        <p>비밀번호 확인</p>
        <input
          type="password"
          value={userReenteredPassword}
          onChange={e => setUserReenteredPassword(e.target.value)}
          placeholder=" 비밀번호 재입력"
        />
        {userPassword && userReenteredPassword && userPassword !== userReenteredPassword && (
          <div className="pw-mismatch-error" style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
        )}
      </div>
      <div className="signup_terms_checkbox_container ">
        <div className="signup_termsContainer">
          <h3>이용약관 (필수)</h3>
          <div className="signup_termsContent" style={{ height: '100px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>제1장 총칙</strong></p>
            <p><strong>제1조 (목적)</strong> 이 약관은 ICEbreaker (이하 “관리자”)가 인터넷과 모바일 등 플랫폼을 통해 제공하는 익명 게시판 및 코딩존 예약 서비스(이하 “서비스”)의 이용과 관련하여 관리자와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            <p><strong>제2조 (용어의 정의)</strong> 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul>
              <li>“관리자”라 함은 온라인을 통하여 서비스를 제공하는 사업자를 의미합니다.</li>
              <li>“이용자”라 함은 본 약관에 동의하고 관리자가 제공하는 서비스의 이용 자격을 부여받은 자를 의미합니다.</li>
              <li>“게시물”이라 함은 이용자가 서비스를 이용함에 있어 게시한 문자로 이루어진 모든 정보를 말합니다.</li>
              <li>“코딩존”이라 함은 관리자가 학과 내 의무적으로 행해야 코딩 학습을 위한 예약 가능한 시간대 및 공간을 의미합니다.</li>
            </ul>
            <p><strong>제3조 (서비스의 제공 및 변경)</strong> 관리자는 다음의 서비스를 제공합니다.</p>
            <ul>
              <li>익명 게시판 서비스</li>
              <li>코딩존 예약 서비스</li>
            </ul>
            <p>관리자는 필요한 경우 서비스의 내용을 변경할 수 있으며, 서비스 변경 내용 및 제공일자를 사전에 홈페이지에 공지합니다.</p>
            <p><strong>제4조 (약관의 명시와 개정)</strong> 관리자는 이 약관을 관리자의 홈페이지에 게시하여 이용자가 언제든지 약관을 열람할 수 있도록 합니다. 관리자는 관련 법령, 정책의 변경이 있을 경우 및 사업의 필요에 따라 약관을 수정할 수 있으며, 수정된 약관은 사전에 홈페이지를 통해 공지합니다.</p>

            <p><strong>제2장 서비스 이용</strong></p>
            <p><strong>제5조 (이용 계약의 성립)</strong> 이용 계약은 이용자가 관리자의 서비스 사용을 신청하고, 관리자가 이를 승낙함으로써 성립합니다. 관리자는 이용자가 제공하는 정보에 대해 이용자가 실명 및 실제 정보를 정확히 기재하여 이용 신청을 한 경우에 상당한 이유가 없는 한 이용 신청을 승낙합니다.</p>
            <p><strong>제6조 (게시물의 관리)</strong> 이용자가 서비스에 게시하는 모든 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다. 관리자는 게시된 게시물이 다음 각 호에 해당하는 경우 사전통지 없이 삭제할 수 있습니다.</p>
            <ul>
              <li>다른 이용자 또는 제3자를 비방하거나 명예훼손, 인권 침해 등의 내용인 경우</li>
              <li>법령 또는 공서양속에 위반되는 내용인 경우</li>
              <li>관리자로부터 사전 승인받지 않은 광고, 홍보물을 포함하는 경우</li>
            </ul>
            <p><strong>제7조 (서비스의 이용 시간)</strong> 서비스의 이용은 관리자의 업무상 또는 기술적 필요에 따라 정해진 시간동안 제공됩니다. 관리자는 서비스 제공시간을 홈페이지에 적절한 방법으로 안내합니다.</p>
          </div>
        </div>
        <label className="signup_checkboxLabel">
          <input
            type="checkbox"
            className="signup_styledCheckbox"
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
          />
          <span className="signup_checkboxCustom" />
          동의합니다
        </label>
      </div>
      <div className="signup_terms_checkbox_container ">
        <div className="signup_termsContainer">
          <h3>개인정보처리방침 (필수)</h3>
          <div className="signup_termsConten" style={{ height: '100px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>1. 개인정보의 수집 및 이용 목적</strong></p>
            <ul>
              <li>익명 게시판 및 코딩 존 예약: 학번, 이름, 이메일 및 비밀번호를 수집하여 서비스 제공에 필요한 최소한의 개인정보를 활용합니다.</li>
              <li>회원 관리: 서비스 이용에 따른 본인 확인, 회원제 서비스 제공, 개인 식별 및 불만 처리 등을 목적으로 합니다.</li>
            </ul>
            <p><strong>2. 개인정보 수집 항목</strong></p>
            <ul>
              <li>수집 항목: 학번, 이름, 이메일, 비밀번호.</li>
            </ul>
            <p><strong>3. 개인정보의 파기</strong></p>
            <ul>
              <li>파기 절차: 회원 탈퇴 시 수집된 모든 개인정보는 즉시 파기됩니다.</li>
              <li>파기 방법: 전자적 파일형태로 저장된 개인정보는 기술적 방법을 사용하여 영구적으로 삭제합니다.</li>
            </ul>
            <p><strong>4. 개인정보의 보호 조치</strong></p>
            <ul>
              <li>보안 대책: 모든 개인정보는 비밀번호로 보호되며, 중요 데이터에 대해서는 암호화 및 파일 잠금 기능을 통해 추가적인 보안을 제공합니다.</li>
            </ul>
            <p><strong>5. 개인정보 최고관리책임자</strong></p>
            <ul>
              <li>성명: 홍길동</li>
              <li>전화번호: 02-1234-5678</li>
              <li>이메일: privacy@example.com</li>
            </ul>
            <p><strong>6. 개인정보 침해 관련 상담 및 신고</strong></p>
            <ul>
              <li>ICEbreaker: privacy@example.com</li>
            </ul>
            <p><strong>7. 개인정보의 열람 및 정정</strong></p>
            <ul>
              <li>접근 및 정정: 귀하는 언제든지 등록된 개인정보를 열람하거나 정정할 수 있습니다. 개인정보 열람 및 정정을 원할 경우 "회원정보수정"을 이용하거나, 개인정보 최고관리책임자에게 연락 가능합니다.</li>
            </ul>
            <p><strong>8. 개인정보 수집, 이용, 제공에 대한 동의 철회</strong></p>
            <ul>
              <li>철회 방법: 귀하는 동의를 철회할 권리가 있으며, "마이페이지"에서 "회원탈퇴"를 통해 언제든지 개인정보의 수집 및 이용 동의를 철회할 수 있습니다. 철회 요청 시 즉시 개인정보를 파기합니다.</li>
            </ul>
            <p><strong>9. 쿠키의 사용</strong></p>
            <ul>
              <li>쿠키 운영: 본 사이트는 사용자의 서비스 이용 편의를 증진하기 위해 쿠키를 사용합니다. 쿠키는 사이트의 효율적 운영을 돕고, 개인화된 사용자 경험을 제공하기 위해 필요합니다. 쿠키를 통해 수집되는 정보에는 사용자의 접속 빈도, 방문 시간, 방문 페이지, 사용자 취향과 관심사 등이 포함됩니다.</li>
            </ul>
            <p><strong>14. 의견수렴 및 불만처리</strong></p>
            <ul>
              <li>의견 접수: 본 사이트는 개인정보 보호와 관련하여 귀하의 의견과 불만을 적극적으로 수렴합니다. 의견이나 불만이 있을 경우 개인정보 최고관리책임자에게 연락 주시면 즉시 조치를 취하고 결과를 통보드립니다.</li>
              <li>면책 조항: 기술적 보완조치에도 불구하고 발생할 수 있는 네트워크 기반의 위험성(해킹, 정보 훼손 등)에 대해서는 사이트 측에서 책임을 지지 않습니다.</li>
            </ul>
          </div>
          <label className="signup_checkboxLabel">
            <input
              type="checkbox"
              className="signup_styledCheckbox"
              checked={agreePrivacy}
              onChange={e => setAgreePrivacy(e.target.checked)}
            />
            <span className="signup_checkboxCustom" />
            동의합니다
          </label>
        </div>
      </div>
      <button type="submit" className="signupButton" onClick={onSignUpButtonClickHandler}>회원가입 완료</button>
    </form>

  );
};


export default SignUpinfoForm;