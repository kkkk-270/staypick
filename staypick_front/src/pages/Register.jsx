import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/register.css';
import { RiKakaoTalkFill } from "react-icons/ri";
import naverIcon from '../assets/images/naver.png';
import KakaoLogin from 'react-kakao-login';
import Agreement from '../components/Agreement';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mode, setMode] = useState('agreement');
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const isAllAgreed = agreementChecked && privacyChecked;

    const {
        isKakaoUser = false,
        isNaverUser = false,
        userid = '',
        username = '',
        email = '',
        mobile = '',
        birthyear = '',
        birthday = ''
    } = location.state || {};

    const [inputId, setInputId] = useState(userid);
    const [inputPw, setInputPw] = useState('');
    const [inputRepw, setInputRepw] = useState('');
    const [inputName, setInputName] = useState(username);
    const [inputPhone, setInputPhone] = useState(mobile.replace(/-/g, ''));
    const [inputEmail, setInputEmail] = useState(email);
    const [birthYear, setBirthYear] = useState(birthyear);
    const [birthMonth, setBirthMonth] = useState(birthday?.substring(0, 2) || '');
    const [birthDay, setBirthDay] = useState(birthday?.substring(2, 4) || '');

    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');
    const [rePwError, setRePwError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [idAvailable, setIdAvailable] = useState(false);
    const [error, setError] = useState('');

    const kakaoApiKey = import.meta.env.VITE_KAKAO_KEY;
    const naverClientId = import.meta.env.VITE_NAVER_CLIENT_ID;
    const naverCallbackUrl = import.meta.env.VITE_NAVER_REDIRECT_URI;

    const validatePassword = () => {
        if(inputPw.length < 8 || inputPw.length > 16) {
            setPwError('비밀번호는 8자 이상, 16자 이하이어야 합니다.')
            return false;
        }

        const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
        if(!pwRegex.test(inputPw)){
            setPwError('비밀번호는 영문+숫자+특수문자 조합이어야 합니다.');
            return false;
        }
        setPwError('');
        return true;
    };

    useEffect(() => {
        if (isKakaoUser || isNaverUser) {
            setInputId(userid);
            setInputName(username);

            if (isNaverUser) {
                setInputPhone(mobile.replace(/-/g, ''));
                setInputEmail(email);

                if (birthyear && birthday && birthday.length === 4) {
                    setBirthYear(birthyear);
                    setBirthMonth(birthday.substring(0, 2));
                    setBirthDay(birthday.substring(2));
                }
            }
        }
    }, [isKakaoUser, isNaverUser, userid, username, mobile, email, birthyear, birthday]); // [수정] 의존성 배열 보완

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const noSpaceValue = value.replace(/\s/g, '');
        switch (name) {
            case 'inputId': setInputId(noSpaceValue); setIdError(''); break;
            case 'inputPw': setInputPw(noSpaceValue); setPwError(''); break;
            case 'inputRepw': setInputRepw(noSpaceValue); setRePwError(''); break;
            case 'inputName': setInputName(noSpaceValue); setNameError(''); break;
            case 'inputPhone': setInputPhone(noSpaceValue.replace(/[^0-9]/g, '').slice(0, 11)); setPhoneError(''); break;
            case 'inputEmail': setInputEmail(noSpaceValue); setEmailError(''); break;
            case 'birth-year': setBirthYear(noSpaceValue.replace(/[^0-9]/g, '').slice(0, 4)); break;
            case 'birth-month': setBirthMonth(noSpaceValue); break;
            case 'birth-day': setBirthDay(noSpaceValue.replace(/[^0-9]/g, '').slice(0, 2)); break;
            default: break;
        }
    };

    const handleIdCheck = async () => {
        if (!inputId.trim()) {
            setIdError('아이디를 입력해주세요.');
            return;
        }

        if(!inputId.length < 6 || inputId.length > 8){
            setIdAvailable(false);
            setIdError('아이디는 6~8자리로 입력해주세요.');
            return;
        }

        if(inputId.toLowerCase() === inputName.toLowerCase()){
            setIdAvailable(false);
            setIdError('아이디는 이름과 동일할 수 없습니다.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/api/auth/check-id/${inputId}`, {
                withCredentials: true
            });
            if (response.data === 'OK') {
                setIdAvailable(true);
                setIdError('사용 가능한 아이디입니다.');
            } else {
                setIdAvailable(false);
                setIdError('이미 존재하는 아이디입니다.');
            }
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
            if (error.response?.status === 409) {
                setIdAvailable(false);
                setIdError('이미 존재하는 아이디입니다.');
            } else {
                setIdError('아이디 중복 확인 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIdError('');
        setPwError('');
        setRePwError('');
        setNameError('');
        setPhoneError('');
        setEmailError('');
        setError('');
        
        let isValid = true;

        if (!isKakaoUser && !isNaverUser) {
            if (!inputId.trim()) { setIdError('아이디를 입력해주세요.'); isValid = false; }
            else if (inputId.length < 6 || inputId.length > 20) { setIdError('아이디를 6~20자 이하로 작성해주세요.'); isValid = false; }
            else if (!idAvailable) { setIdError('아이디 중복 확인을 해주세요.'); isValid = false; }

            if (!inputPw.trim()) { setPwError('비밀번호를 입력해주세요.'); isValid = false; }
            if (!inputRepw.trim()) { setRePwError('비밀번호 확인을 입력해주세요.'); isValid = false; }
            else if (inputPw !== inputRepw) { setRePwError('비밀번호가 일치하지 않습니다.'); isValid = false; }
        }

        if(validatePassword()){
            console.log('비밀번호 유효성 검사 통과');
        }

        if (!inputName.trim()) { setNameError('이름을 입력해주세요.'); isValid = false; }

        if (!inputPhone.trim()) { setPhoneError('전화번호를 입력해주세요.'); isValid = false; }
        else if (inputPhone.length !== 11) { setPhoneError('전화번호를 11자리로 입력해주세요.("-" 제외)'); isValid = false; }

        if (!inputEmail.trim()) { setEmailError('이메일 주소를 입력해주세요.'); isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(inputEmail)) { setEmailError('올바른 이메일 주소 형식이 아닙니다.'); isValid = false; }

        if (!isValid) return;

        const birth = birthYear && birthMonth && birthDay
            ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
            : null;

        try {
            const endpoint = isKakaoUser
                ? 'http://localhost:8081/api/auth/kakao-register'
                : isNaverUser
                    ? 'http://localhost:8081/api/auth/naver-register'
                    : 'http://localhost:8081/api/auth/register';

            const payload = {
                userid: inputId,
                password: isKakaoUser || isNaverUser ? null : inputPw,
                inputRepw: isKakaoUser || isNaverUser ? null : inputRepw,
                username: inputName,
                tel: inputPhone,
                email: inputEmail,
                birth: birth,
                role: 'USER',
                isKakaoUser,
                isNaverUser
            };

            await axios.post(endpoint, payload);
            
            setMode('complete');
        } catch (error) {
            console.error('회원가입 오류:', error);
            setError(error.response?.data || '회원가입에 실패했습니다.');
        }
    };

    // ✅ 카카오 회원가입
  const kakaoResponse = async (response) => {
    const { access_token } = response.response;
    try {
      const res = await axios.post('http://localhost:8081/api/auth/kakao-login', {
        accessToken: access_token
      });

      if (res.data.token) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          userid: payload.sub,
          username: payload.username,
          role: payload.role
        };
        setAuth({ user, token });
        navigate('/');
      } else if (res.data.needAdditionalInfo) {
        navigate('/register', {
          state: {
            userid: res.data.userid,
            username: res.data.username,
            isKakaoUser: true
          }
        });
      } else {
        alert("응답 형식이 예상과 다릅니다.");
      }
    } catch (err) {
      console.error('카카오 로그인 실패', err);
      alert('카카오 로그인 실패');
    }
  };

    // ✅ 네이버 회원가입
    const handleNaverLogin = () => {
        const state = Math.random().toString(36).substring(2, 15);
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${encodeURIComponent(naverCallbackUrl)}&state=${state}`;
        window.location.href = naverAuthUrl;
    };

    const handleNaverRedirect = async () => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const state = params.get("state");

        if (code && state) {
        try {
            const res = await axios.post(
            'http://localhost:8081/api/auth/naver-login', 
            { code, state },
            {
                headers: {
                Authorization: ''
                }
            }
            );

            if (res.data.token) {
            const token = res.data.token;
            localStorage.setItem('token', token);
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user = {
                userid: payload.sub,
                username: payload.username,
                role: payload.role
            };
            setAuth({ user, token });
            navigate('/');
            } else if (res.data.needAdditionalInfo) {
            navigate('/register', {
                state: {
                userid: res.data.userid,
                username: res.data.username,
                email: res.data.email,
                isNaverUser: true
                }
            });
            } else {
            alert("응답 형식이 예상과 다릅니다.");
            }
        } catch (err) {
            console.error('네이버 로그인 실패', err);
            alert('네이버 로그인 실패');
        }
        }
    };

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoApiKey);
        }
        handleNaverRedirect();
    }, []);

    if (mode === 'agreement') {
        return (
            <>
                <div className="register-steps">
                            <div className={`step ${mode === 'agreement' ? 'active' : ''}`}>1. 약관 동의</div>
                            <div className={`step ${mode === 'select' || mode === 'sns' || mode === 'normal' ? 'active' : ''}`}>2. 정보 입력</div>
                            <div className={`step ${mode === 'complete' ? 'active' : ''}`}>3. 가입 완료</div>
                </div>
                <Agreement onAgreementChange={setAgreementChecked} onPrivacyChange={setPrivacyChecked} />
                <button
                    className="agree-btn"
                    onClick={() => {
                        setMode('form')
                        if (agreementChecked && privacyChecked) setMode('select');
                        else alert('모든 약관에 동의해주세요.');
                    }}
                    disabled={!isAllAgreed}
                >
                    다음으로
                </button>
            </>
        );
    }


    if(mode === 'select'){
        return(
            <>
                <div className="register-steps">
                    <div className={`step ${mode === 'agreement' ? 'active' : ''}`}>1. 약관 동의</div>
                    <div className={`step ${mode === 'select' || mode === 'sns' || mode === 'normal' ? 'active' : ''}`}>2. 정보 입력</div>
                    <div className={`step ${mode === 'complete' ? 'active' : ''}`}>3. 가입 완료</div>
                </div>
                <div className="signUpPage">
                    <h1>회원가입 방법</h1>
                    <div className="register-select-buttons">
                        <button onClick={() => setMode('normal')} className="select-btn">일반 회원가입</button>
                    </div>
                    <div className="register-select-buttons">
                        <button onClick={() => setMode('sns')} className="select-btn">SNS 회원가입</button>
                    </div>
                </div>
            </>
        );
    }

    if (mode === 'sns') {
        return (
            <>
                <div className="register-steps">
                    <div className={`step ${mode === 'agreement' ? 'active' : ''}`}>1. 약관 동의</div>
                    <div className={`step ${mode === 'select' || mode === 'sns' || mode === 'normal' ? 'active' : ''}`}>2. 정보 입력</div>
                    <div className={`step ${mode === 'complete' ? 'active' : ''}`}>3. 가입 완료</div>
                </div>
                <div className="signUpPage">
                    <h1>SNS로 회원가입</h1>
                    <div className="social">
                        <KakaoLogin
                            token={kakaoApiKey}
                            onSuccess={kakaoResponse}
                            onFailure={kakaoResponse}
                            scope="account_email,profile_nickname,profile_image"
                            render={({ onClick }) => (
                                <button onClick={onClick} className='kakao-btn'>
                                    <RiKakaoTalkFill className='kakao-icon' /> 카카오로 로그인하기
                                </button>
                            )}                    
                        />
                        <button className="naver-btn" onClick={handleNaverLogin}>
                            <img src={naverIcon} alt="naver-icon" />네이버로 로그인
                        </button>
                    </div>
                    
                    <button className="reselect-Check-btn" onClick={() => setMode('select')}>가입 방식 다시 선택</button>
                </div>
            </>
        );
    }

    if(mode === 'complete'){
        return(
            <>
                <div className="register-steps">
                    <div className={`step ${mode === 'agreement' ? 'active' : ''}`}>1. 약관 동의</div>
                    <div className={`step ${mode === 'select' || mode === 'sns' || mode === 'normal' ? 'active' : ''}`}>2. 정보 입력</div>
                    <div className={`step ${mode === 'complete' ? 'active' : ''}`}>3. 가입 완료</div>
                </div>
                <div className="step complete active">
                    <p>STAYPICK 회원가입을 진심으로 환영합니다.</p>
                    <button
                        className="btn-home"
                        onClick={() => navigate('/')}
                        type="button"
                    >
                        메인으로
                    </button>
                </div>
                
                
            </>
        )
    }

    const getStepLabel = () => {
        switch (mode) {
            case 'agreement': return '1. 약관 동의';
            case 'input': return '2. 정보 입력';
            case 'complete': return '3. 가입 완료';
            default: return '';
        }
    };

    return (
        <div>
            <div className="register-steps">
                <div className={`step ${mode === 'agreement' ? 'active' : ''}`}>1. 약관 동의</div>
                <div className={`step ${mode === 'select' || mode === 'sns' || mode === 'normal' ? 'active' : ''}`}>2. 정보 입력</div>
                <div className={`step ${mode === 'complete' ? 'active' : ''}`}>3. 가입 완료</div>
            </div>
            <form name="join_form" onSubmit={handleSubmit} id="join_form">
                <div className="signUpPage">
                    <h1>회원가입</h1>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                    <div className="signUpPage-box">

                        {(isKakaoUser || isNaverUser) ? (
                            <>
                                <div className="signUpTitle">아이디</div>
                                <input type="text" name="inputId" value={inputId} readOnly />
                            </>
                        ) : (
                            <>
                                <div className="signUpTitle">아이디 <span className="error-message">{idError}</span></div>
                                <input type="text" name="inputId" value={inputId} onChange={handleInputChange} placeholder='이름과 동일하지 않은 6~8자로 입력해주세요.' />
                                <button className="idCheck-btn" type="button" onClick={handleIdCheck}>중복확인</button>

                                <div className="signUpTitle">비밀번호 <span className="error-message">{pwError}</span></div>
                                <input type="password" name="inputPw" value={inputPw} onChange={handleInputChange} onBlur={validatePassword} placeholder='영문+숫자+특수문자 조합으로 8~16자로 입력해주세요.' />

                                <div className="signUpTitle">비밀번호 확인 <span className="error-message">{rePwError}</span></div>
                                <input type="password" name="inputRepw" value={inputRepw} onChange={handleInputChange} placeholder='위와 동일한 비밀번호를 다시 한 번 입력해주세요.' />
                            </>
                        )}

                        <div className="signUpTitle">이름 <span className="error-message">{nameError}</span></div>
                        <input type="text" name="inputName" value={inputName} onChange={handleInputChange} readOnly={isNaverUser} placeholder='이름을 입력해주세요.' />

                        <div className="signUpTitle">전화번호 <span className="error-message">{phoneError}</span></div>
                        <input type="text" name="inputPhone" value={inputPhone} onChange={handleInputChange} placeholder="전화번호를 입력해주세요.('-' 제외)" />

                        <div className="signUpTitle">이메일 <span className="error-message">{emailError}</span></div>
                        <input type="email" name="inputEmail" value={inputEmail} onChange={handleInputChange} onKeyDown={(e) => {if(e.key === ' ') e.preventDefault()}} readOnly={isNaverUser} placeholder='이메일을 입력해주세요.' />

                        <div className="signUpTitle">생년월일(선택)</div>
                        <div className="birth-box">
                            <input className='me-1' type="number" name="birth-year" placeholder="년" value={birthYear} onChange={handleInputChange} />
                            <p className='mt-2 me-2'>년</p>
                            <input className='me-1' type='number' name="birth-month" placeholder="월" value={birthMonth} onChange={handleInputChange} />
                            <p className='mt-2 me-2'>월</p>
                            <input className='me-1' type="number" name="birth-day" placeholder="일" value={birthDay} onChange={handleInputChange} />
                            <p className='mt-2'>일</p>
                        </div>

                        <button type="submit" className="signUp-Check-btn submitButton" onClick={() => setMode('complete')}>가입하기</button>
                        <button className="reselect-Check-btn" type="button" onClick={() => setMode('select')}>가입방식 다시 선택</button>
                        
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
