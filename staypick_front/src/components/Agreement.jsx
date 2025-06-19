import React, {useState, useEffect} from 'react'

const Agreement = ({onAgreementChange, onPrivacyChange}) => {
    
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    const allAgreed = agreementChecked && privacyChecked;

    useEffect(() => {
        onAgreementChange?.(agreementChecked);
    }, [agreementChecked]);

    useEffect(() => {
        onPrivacyChange?.(privacyChecked);
    }, [privacyChecked]);

    return (
        <>  
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

                
            </div>
        </>
  )
}

export default Agreement