import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/register.css';
import { RiKakaoTalkFill } from "react-icons/ri";
import naverIcon from '../assets/images/naver.png';
import KakaoLogin from 'react-kakao-login';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mode, setMode] = useState('agreement');
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

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
        setAllAgreed(agreementChecked && privacyChecked);
    }, [agreementChecked, privacyChecked]);

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
                <div className="signUpPage">
                <h1>회원가입 약관 동의</h1>

                <div className="terms-box">
                    <div className="terms-section">
                        <h2>이용약관</h2>
                        <div className="terms-content scroll-box">
                            <h3>제1조 (목적)</h3>
                            <p>이 약관은 [서비스명](이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>

                            <h3>제2조 (정의)</h3>
                            <ul>
                                <li>"서비스"란 회사가 제공하는 웹사이트, 모바일 앱 등을 통해 이용할 수 있는 모든 서비스를 말합니다.</li>
                                <li>"회원"이란 회사의 서비스에 회원가입을 하고 약관에 따라 이용계약을 체결한 자를 말합니다.</li>
                            </ul>

                            <h3>제3조 (약관의 효력 및 변경)</h3>
                            <ol>
                                <li>이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.</li>
                                <li>회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.</li>
                            </ol>

                            <h3>제4조 (회원가입)</h3>
                            <p>회원은 회사가 정한 절차에 따라 가입신청을 하여야 하며, 회원가입은 만 14세 이상인 자만 가능합니다.</p>

                            <h3>제5조 (회원의 의무)</h3>
                            <ol>
                                <li>회원은 관계법령, 본 약관, 이용안내 등을 준수해야 합니다.</li>
                                <li>타인의 정보를 도용하거나 부정하게 사용하는 행위를 금지합니다.</li>
                            </ol>

                            <h3>제6조 (서비스 이용)</h3>
                            <ol>
                                <li>회사는 연중무휴, 1일 24시간 서비스를 제공합니다. 단, 점검 등으로 중단될 수 있습니다.</li>
                                <li>회사는 서비스의 일부 또는 전부를 정책에 따라 변경하거나 중단할 수 있습니다.</li>
                            </ol>

                            <h3>제7조 (계약 해지 및 이용 제한)</h3>
                            <p>회사는 이용자가 약관에 위반되는 행위를 한 경우, 서비스 이용을 제한하거나 이용계약을 해지할 수 있습니다.</p>

                            <h3>제8조 (면책조항)</h3>
                            <ul>
                                <li>천재지변 등으로 서비스를 제공할 수 없는 경우 회사는 책임을 지지 않습니다.</li>
                                <li>회원의 귀책사유로 인한 서비스 장애에 대해 회사는 책임을 지지 않습니다.</li>
                            </ul>

                            <h3>제9조 (분쟁 해결)</h3>
                            <p>서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 회원은 원만한 해결을 위해 노력합니다.</p>
                        </div>
                        <label className="agree-checkbox">
                            <input
                            type="checkbox"
                            checked={agreementChecked}
                            onChange={(e) => setAgreementChecked(e.target.checked)}
                            />
                            이용약관에 동의합니다. (필수)
                        </label>
                        </div>

                        <div className="terms-section">
                        <h2>개인정보 수집 및 이용 동의</h2>
                        <div className="terms-content scroll-box">
                            <h3>1. 수집하는 개인정보 항목</h3>
                            <p>회사는 회원가입, 상담, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집합니다.</p>
                            <ul>
                                <li>필수항목: 이름, 아이디, 비밀번호, 이메일, 휴대전화번호, 생년월일</li>
                                <li>선택항목: 주소, 성별 등</li>
                                <li>자동 수집 항목: IP 주소, 쿠키, 접속 로그 등</li>
                            </ul>

                            <h3>2. 개인정보의 수집 및 이용 목적</h3>
                            <ul>
                                <li>회원 관리 (본인 확인, 개인 식별 등)</li>
                                <li>서비스 제공 (콘텐츠 제공, 결제, 배송 등)</li>
                                <li>마케팅 및 광고 활용 (이벤트 안내, 맞춤형 서비스 제공 등)</li>
                            </ul>

                            <h3>3. 개인정보 보유 및 이용 기간</h3>
                            <ul>
                                <li>회원 탈퇴 시까지 또는 관련 법령이 정한 기간까지 보유</li>
                                <li>예: 전자상거래법에 따른 보존 기간 (계약/결제/배송 정보 등)</li>
                            </ul>

                            <h3>4. 개인정보의 제3자 제공</h3>
                            <p>회사는 회원의 사전 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 따라 제공이 필요한 경우에는 예외로 합니다.</p>

                            <h3>5. 개인정보의 파기 절차 및 방법</h3>
                            <ul>
                                <li>보유 기간 경과 또는 처리 목적 달성 시 지체 없이 파기</li>
                                <li>전자 파일: 복구 불가능한 방법으로 삭제</li>
                                <li>종이 문서: 분쇄 또는 소각</li>
                            </ul>

                            <h3>6. 이용자 및 법정대리인의 권리</h3>
                            <p>이용자 및 법정대리인은 언제든지 등록된 개인정보를 조회하거나 수정, 삭제 요청할 수 있습니다.</p>

                            <h3>7. 개인정보 보호책임자</h3>
                            <ul>
                                <li>이름: 홍길동</li>
                                <li>이메일: privacy@[yourdomain].com</li>
                                <li>전화번호: 02-0000-0000</li>
                            </ul>

                            <h3>8. 고지의 의무</h3>
                            <p>본 개인정보처리방침은 관련 법령이나 회사 정책에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해 공지됩니다.</p>
                        </div>
                        <label className="agree-checkbox">
                            <input
                            type="checkbox"
                            checked={privacyChecked}
                            onChange={(e) => setPrivacyChecked(e.target.checked)}
                            />
                            개인정보 수집 및 이용에 동의합니다. (필수)
                        </label>
                        </div>

                        <label className="agree-checkbox all-agree">
                        <input
                            type="checkbox"
                            checked={agreementChecked && privacyChecked}
                            onChange={(e) => {
                            const checked = e.target.checked;
                            setAgreementChecked(checked);
                            setPrivacyChecked(checked);
                            }}
                        />
                        모든 약관에 동의합니다
                        </label>
                    </div>

                    <button
                        className="agree-btn"
                        onClick={() => {
                            setMode('form')
                            if (agreementChecked && privacyChecked) setMode('select');
                            else alert('모든 약관에 동의해주세요.');
                        }}
                        disabled={!allAgreed}
                    >
                        다음으로
                    </button>
                </div>
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
                if(registerSuccess){
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
                }
                
                
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
                                <input type="text" name="inputId" value={inputId} onChange={handleInputChange} />
                                <button className="idCheck-btn" type="button" onClick={handleIdCheck}>중복확인</button>

                                <div className="signUpTitle">비밀번호 <span className="error-message">{pwError}</span></div>
                                <input type="password" name="inputPw" value={inputPw} onChange={handleInputChange} onBlur={validatePassword} />

                                <div className="signUpTitle">비밀번호 확인 <span className="error-message">{rePwError}</span></div>
                                <input type="password" name="inputRepw" value={inputRepw} onChange={handleInputChange} />
                            </>
                        )}

                        <div className="signUpTitle">이름 <span className="error-message">{nameError}</span></div>
                        <input type="text" name="inputName" value={inputName} onChange={handleInputChange} readOnly={isNaverUser} />

                        <div className="signUpTitle">전화번호 <span className="error-message">{phoneError}</span></div>
                        <input type="text" name="inputPhone" value={inputPhone} onChange={handleInputChange} />

                        <div className="signUpTitle">이메일 <span className="error-message">{emailError}</span></div>
                        <input type="email" name="inputEmail" value={inputEmail} onChange={handleInputChange} onKeyDown={(e) => {if(e.key === ' ') e.preventDefault()}} readOnly={isNaverUser} />

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
