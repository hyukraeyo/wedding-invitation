export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 prose prose-stone">
            <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>

            <p className="text-gray-600 mb-8">
                &apos;바나나웨딩&apos;(이하 &apos;서비스&apos;)은 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하며,
                이용자의 개인정보를 안전하게 처리하고 보호하기 위해 다음과 같은 처리방침을 수립·공개합니다.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1. 개인정보의 수집 및 이용 목적</h3>
            <p>서비스는 다음의 목적을 위해 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
                <li><strong>회원 가입 및 관리:</strong> 네이버/카카오 소셜 로그인을 통한 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 등을 목적으로 합니다.</li>
                <li><strong>서비스 제공:</strong> 모바일 청첩장 생성, 수정, 보관 및 게시된 콘텐츠의 관리, 고충 처리 등 원활한 서비스 운영을 위해 활용됩니다.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">2. 수집하는 개인정보의 항목</h3>
            <p>서비스는 원활한 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <div className="bg-gray-50 p-4 rounded-lg my-4 border border-gray-200 text-gray-900">
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>필수 수집 항목:</strong> 소셜 계정 고유 식별값(네이버/카카오 ID), 이름, 이메일, 별명(닉네임), 프로필 사진, 성별, 생일, 출생연도, 휴대전화 번호</li>
                    <li><strong>수집 방법:</strong> 소셜 로그인 연동 및 회원 가입 시 이용자의 직접 입력</li>
                </ul>
            </div>
            <p className="text-sm text-gray-500">
                * 수집된 휴대폰 번호는 중복 가입 방지 및 1인 1계정 원칙 준수를 위한 본인 확인 용도로만 사용되며, 광고성 마케팅 목적으로 활용되지 않습니다.
                네이버 로그인 API를 통해 제공받는 식별값은 안전한 암호화 알고리즘으로 보호됩니다.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">3. 개인정보의 보유 및 이용 기간</h3>
            <p>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
                <li><strong>보유 기간:</strong> 회원 탈퇴 시까지</li>
                <li><strong>예외 보관:</strong> 서비스 부정이용 기록이 있는 경우, 재가입 제한 및 부정 이용 방지를 위해 탈퇴 후 1년간 해당 항목(식별값, 휴대폰 번호)을 암호화하여 보관합니다.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">4. 정보주체의 권리 및 행사방법</h3>
            <p>이용자는 언제든지 자신의 개인정보에 대하여 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
                <li>개인정보 열람 요구 및 오류 발견 시 정정 요구</li>
                <li>서비스 탈퇴를 통한 개인정보 삭제 요구</li>
                <li>개인정보 처리 정지 요구</li>
            </ul>
            <p className="text-sm">권리 행사는 마이페이지 내 정보 수정 또는 고객센터(이메일)를 통해 서면이나 전자우편으로 신청하실 수 있으며, 서비스는 이에 대해 지체 없이 조치하겠습니다.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">5. 개인정보의 안전성 확보 조치</h3>
            <p>서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
                <li><strong>기술적 조치:</strong> 개인정보의 암호화 저장, 보안 프로그램 설치 및 주기적 업데이트</li>
                <li><strong>관리적 조치:</strong> 개인정보 접근 권한 최소화 및 정기적인 보안 교육</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">6. 개인정보 보호책임자</h3>
            <p>개인정보 처리에 관한 업무를 총괄해서 책임지고, 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">
                <p className="font-bold">바나나웨딩 운영팀</p>
                <p className="text-sm mt-1">이메일: cs@bananawedding.com</p>
            </div>

            <hr className="my-12 border-gray-200" />
            <p className="text-sm text-gray-400">시행일자: 2024년 1월 1일</p>
        </div>
    );
}
