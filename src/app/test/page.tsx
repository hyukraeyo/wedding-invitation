'use client';

import React, { useState } from 'react';
import { Button, Heading, Box, Flex, Card } from '@/components/ui';
import { Dialog } from '@/components/ui/Dialog';
import { Calendar } from '@/components/ui/Calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function TestPage() {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <Box style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <Card style={{ padding: '24px' }}>
                <Flex direction="column" gap="4">
                    <Heading size="6">컴포넌트 테스트 페이지</Heading>

                    <Box>
                        <Heading size="3" style={{ marginBottom: '12px' }}>1. 모달 및 달력 테스트</Heading>
                        <Button onClick={() => setOpen(true)}>달력 모달 열기</Button>
                        <p style={{ marginTop: '12px' }}>
                            선택된 날짜: {date ? format(date, 'PPP', { locale: ko }) : '없음'}
                        </p>
                    </Box>

                    <Box style={{ border: '1px solid #eee', padding: '20px', borderRadius: '12px' }}>
                        <Heading size="3" style={{ marginBottom: '12px' }}>2. 인라인 달력 테스트</Heading>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                        />
                    </Box>
                </Flex>
            </Card>

            <Dialog open={open} onOpenChange={setOpen} mobileBottomSheet>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content>
                        <Dialog.Header title="테스트 모달" />
                        <Dialog.Body>
                            <div style={{ padding: '10px', backgroundColor: '#fff3cd', marginBottom: '10px', textAlign: 'center' }}>
                                <strong>직접 렌더링 테스트:</strong> 이 문구가 보이나요?
                            </div>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setDate(d);
                                    setOpen(false);
                                }}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button onClick={() => setOpen(false)}>닫기</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </Box>
    );
}
