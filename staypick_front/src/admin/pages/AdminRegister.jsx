import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../css/register.css'
import AdminStepIndicator from '../components/AdminStepIndicator'
import AdminAgreement from '../components/AdminAgreement'

const AdminRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

    const [agreement, setAgreement] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [bizTerms, setBizTerms] = useState(false);

    const [inputId, setInputId] = useState('');
    const [inputPw, setInputPw] = useState('');
    const [inputRepw, setInputRepw] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputPhone, setInputPhone] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [bizNumber, setBizNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [ceoName, setCeoName] = useState('');
    const [accName, setAccName] = useState('');
    const [accType, setAccType] = useState('');
    const [accTel, setAccTel] = useState('');
    const [accZipcode, setAccZipcode] = useState('');
    const [accAddress, setAccAddress] = useState('');

    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');
    const [rePwError, setRePwError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [bizNumError, setBizNumError] = useState('');
    const [cpNameError, setCpNameError] = useState('');
    const [ceoNameError, setCeoNameError] = useState('');
    const [accNameError, setAccNameError] = useState('');
    const [accTypeError, setAccTypeError] = useState('');
    const [accTelError, setAccTelError] = useState('');
    const [accZipcodeError, setAccZipcodeError] = useState('');
    const [accAddrError, setAccAddrError] = useState('');
    const [idAvailable, setIdAvailable] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const kakaoApiKey = import.meta.env.VITE_KAKAO_KEY;

        const script1 = document.createElement('script');
        script1.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script1.async = true;
        document.body.appendChild(script1);

        // Kakao Map SDK
        const script2 = document.createElement('script');
        script2.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services`;
        script2.async = true;
        script2.onload = () => setIsKakaoLoaded(true);
        document.body.appendChild(script2);

        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []);

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

    const handleChange = (e) => {
        const {name, value} = e.target;
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
            case 'businessNumber': setBizNumber(noSpaceValue); setBizNumError(''); break;
            case 'companyName': setCompanyName(noSpaceValue); setCpNameError(''); break;
            case 'ceoName': setCeoName(noSpaceValue); setCeoNameError(''); break;
            case 'accommodationName': setAccName(noSpaceValue); setAccNameError(''); break;
            case 'accommodationType': setAccType(noSpaceValue); setAccTypeError(''); break;
            case 'accommodationTel': setAccTel(noSpaceValue); setAccTelError(''); break;
            case 'accommodationZipcode': setAccZipcode(noSpaceValue); setAccZipcodeError(''); break;
            case 'accommodationAddress': setAccAddress(noSpaceValue); setAccAddrError(''); break;
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
    
    const handlePostcode = () => {
        if (!isKakaoLoaded || !window.daum || !window.daum.Postcode || !window.daum.maps || typeof window.daum.maps.LatLng !== 'function') {
            alert("지도를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new window.daum.maps.LatLng(37.537187, 127.005476),
            level: 5,
        };

        const map = new window.daum.maps.Map(mapContainer, mapOption);
        const geocoder = new window.daum.maps.services.Geocoder();
        const marker = new window.daum.maps.Marker({
            position: new window.daum.maps.LatLng(37.537187, 127.005476),
            map: map,
        });

        new window.daum.Postcode({
            oncomplete: function (data) {
            const addr = data.address;
            setAccAddress(addr); // React 상태 업데이트
            mapContainer.style.display = "block";
            geocoder.addressSearch(addr, function (results, status) {
                if (status === window.daum.maps.services.Status.OK) {
                const result = results[0];
                const coords = new window.daum.maps.LatLng(result.y, result.x);
                map.setCenter(coords);
                marker.setPosition(coords);
                }
            });
            },
        }).open();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIdError('');
        setPwError('');
        setRePwError('');
        setNameError('');
        setPhoneError('');
        setEmailError('');
        setBizNumError('');
        setCpNameError('');
        setCeoNameError('');
        setAccNameError('');
        setAccTypeError('');
        setAccTelError('');
        setAccZipcodeError('');
        setAccAddrError('');
        setError('');
        
        let isValid = true;

        if (!inputId.trim()) { setIdError('아이디를 입력해주세요.'); isValid = false; }
        else if (inputId.length < 6 || inputId.length > 20) { setIdError('아이디를 6~20자 이하로 작성해주세요.'); isValid = false; }
        else if (!idAvailable) { setIdError('아이디 중복 확인을 해주세요.'); isValid = false; }

        if (!inputPw.trim()) { setPwError('비밀번호를 입력해주세요.'); isValid = false; }
        if (!inputRepw.trim()) { setRePwError('비밀번호 확인을 입력해주세요.'); isValid = false; }
        else if (inputPw !== inputRepw) { setRePwError('비밀번호가 일치하지 않습니다.'); isValid = false; }

        if (!inputName.trim()) { setNameError('이름을 입력해주세요.'); isValid = false; }

        if (!inputPhone.trim()) { setPhoneError('전화번호를 입력해주세요.'); isValid = false; }
        else if (inputPhone.length !== 11) { setPhoneError('전화번호를 11자리로 입력해주세요.("-" 제외)'); isValid = false; }

        if (!inputEmail.trim()) { setEmailError('이메일 주소를 입력해주세요.'); isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(inputEmail)) { setEmailError('올바른 이메일 주소 형식이 아닙니다.'); isValid = false; }
        
        if(!bizNumber.trim()) { setBizNumError('사업자 등록번호를 입력해주세요.'); isValid = false; }

        if(!companyName.trim()) { setCpNameError('상호명을 입력해주세요.'); isValid = false; }

        if(!ceoName.trim()) { setCeoNameError('대표자명을 입력해주세요.'); isValid = false; }

        if(!accName.trim()) { setAccNameError('숙소명을 입력해주세요.'); isValid = false; }

        if(!accType.trim()) { setAccTypeError('숙소 유형을 골라주세요.'); isValid = false; }

        if(!accTel.trim()) { setAccTelError('숙소 전화번호를 입력해주세요.'); isValid = false; }

        if(!accZipcode.trim()) { setAccZipcodeError('숙소 우편번호를 입력해주세요.'); isValid = false; }

        if(!accAddress.trim()) { setAccAddrError('숙소 주소를 입력해주세요.'); isValid = false; }

        if (!isValid) return;

        const birth = birthYear && birthMonth && birthDay
            ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
            : null;
        
        try{
            const endpoint = 'http://localhost:8081/api/auth/register';

            const payload = {
                userid: inputId,
                password: inputPw,
                inputRepw: inputRepw,
                username: inputName,
                tel: inputPhone,
                email: inputEmail,
                birth: birth,
                role: 'ADMIN',
                bizNumber: bizNumber,
                companyName: companyName,
                ceoName: ceoName,
                accName: accName,
                accType: accType,
                accTel: accTel,
                accZipcode: accZipcode,
                accAddress: accAddress,
            };

            await axios.post(endpoint, payload);
            
            setMode('complete');
        }catch(err){
            console.error('회원가입 오류: ', err);
            setError(err.response?.data || '회원가입에 실패했습니다.');
        }
    };

    if(step === 1){
        return(
            <div className="register-step">
                <AdminStepIndicator step={1} />
                <AdminAgreement 
                    onAgreementChange={setAgreement}
                    onPrivacyChange={setPrivacy}
                    onBizTermsChange={setBizTerms}
                />
                <div className="agree-btn-container">
                    <button 
                        onClick={() => setStep(2)}
                        disabled={!(agreement && privacy && bizTerms)}
                        className='agree-btn'
                    >
                        다음
                    </button>
                </div>
            </div>
        )
    }

    if(step === 3){
        return(
            <div className="register-complete">
                <AdminStepIndicator step={3} />
                <h2>가입 신청 완료</h2>
                <p>관리자 승인 후 이용이 가능합니다.</p>
                <button onClick={() => navigate('/')}>메인으로 이동</button>
            </div>
        )
    }
    return (
        <div>
            <AdminStepIndicator step={2} />
            <form onSubmit={handleSubmit} className="join_form" id="join_form">
                <div className="signUpPage">
                    <h1>회원가입</h1>
                    <div className="signUpPage-box">
                        <div className="signUpTitle">아이디 <span className="error-message">{idError}</span></div>
                        <input type="text" name="inputId" value={inputId} onChange={handleChange} placeholder='이름과 동일하지 않은 6~8자로 입력해주세요.' />
                        <button className="idCheck-btn" type="button" onClick={handleIdCheck}>중복확인</button>

                        <div className="signUpTitle">비밀번호 <span className="error-message">{pwError}</span></div>
                        <input type="password" name="inputPw" value={inputPw} onChange={handleChange} onBlur={validatePassword} placeholder='영문+숫자+특수문자 조합으로 8~16자로 입력해주세요.' />

                        <div className="signUpTitle">비밀번호 확인 <span className="error-message">{rePwError}</span></div>
                        <input type="password" name="inputRepw" value={inputRepw} onChange={handleChange} placeholder='위와 동일한 비밀번호를 다시 한 번 입력해주세요.' />
                        <div className="signUpTitle">이름 <span className="error-message">{nameError}</span></div>
                                <input type="text" name="inputName" value={inputName} onChange={handleChange} placeholder='이름을 입력해주세요.' />

                                <div className="signUpTitle">전화번호 <span className="error-message">{phoneError}</span></div>
                                <input type="text" name="inputPhone" value={inputPhone} onChange={handleChange} placeholder="전화번호를 입력해주세요.('-' 제외)" />

                                <div className="signUpTitle">이메일 <span className="error-message">{emailError}</span></div>
                                <input type="email" name="inputEmail" value={inputEmail} onChange={handleChange} onKeyDown={(e) => {if(e.key === ' ') e.preventDefault()}} placeholder='이메일을 입력해주세요.' />

                                <div className="signUpTitle">생년월일(선택)</div>
                                <div className="birth-box">
                                    <input className='me-1' type="number" name="birth-year" placeholder="년" value={birthYear} onChange={handleChange} />
                                    <p className='mt-2 me-2'>년</p>
                                    <input className='me-1' type='number' name="birth-month" placeholder="월" value={birthMonth} onChange={handleChange} />
                                    <p className='mt-2 me-2'>월</p>
                                    <input className='me-1' type="number" name="birth-day" placeholder="일" value={birthDay} onChange={handleChange} />
                                    <p className='mt-2'>일</p>
                                </div>

                        <h3>사업자 정보</h3>
                        <input name="businessNumber" placeholder="사업자등록번호" value={bizNumber} onChange={handleChange} required />
                        <input name="companyName" placeholder="상호명" value={companyName} onChange={handleChange} required />
                        <input name="ceoName" placeholder="대표자명" value={ceoName} onChange={handleChange} required />

                        <h3>숙소 정보</h3>
                        <input name="accommodationName" placeholder="숙소명" value={accName} onChange={handleChange} required />
                        <select name="accommodationType" value={accType} onChange={handleChange} required>
                            <option value="">숙소 유형 선택</option>
                            <option value="호텔">호텔</option>
                            <option value="펜션">펜션</option>
                            <option value="게스트하우스">게스트하우스</option>
                            <option value="모텔">모텔</option>
                            <option value="리조트">리조트</option>
                        </select>
                        <input name="accommodationPhone" placeholder="숙소 전화번호" value={accTel} onChange={handleChange} required />
                        <input 
                            type="text" 
                            id="sample5_address"
                            name="accommodationAddress"
                            value={accAddress}
                            onChange={handleChange}
                            placeholder='숙소 주소'
                            readOnly
                        />
                        <button type="button" onClick={handlePostcode}>주소 검색</button>
                        <div id="map" style={{ width: '300px', height: '300px', marginTop: '10px', display: 'none' }} />

                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">가입하기</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AdminRegister