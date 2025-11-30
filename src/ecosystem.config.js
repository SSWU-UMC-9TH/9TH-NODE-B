module.exports = {
    apps: [{
        name: 'umc-9th',
        script: './index.js', // 실행할 메인 파일 경로 확인 필요
        instances: 'max',         // CPU 코어 수만큼 프로세스 생성 (무중단 필수 조건)
        exec_mode: 'cluster',     // 클러스터 모드 활성화
        merge_logs: true,         // 로그 병합
        autorestart: true,        // 프로세스 실패 시 자동 재시작
        watch: false,             // 파일 변경 감지 비활성화 (프로덕션은 false 권장)
        // 환경 변수 설정
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        }
    }]
};